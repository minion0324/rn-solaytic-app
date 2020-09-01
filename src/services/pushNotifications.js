import { AppState } from 'react-native';
import firebase from 'react-native-firebase';

import { PLATFORM } from 'src/constants';

const CHANNEL_ID = 'notification-channel';
const CHANNEL_NAME = 'Notifications';
const CHANNEL_DESCRIPTION = 'Notification Channel';

class PushNotifications {
  async connect(handler) {
    this.registrationTokenHandler = handler;

    if (PLATFORM === 'android') {
      this.createNotificationChannel();
    }

    await this.checkPermission();
    this.registerListeners();
    this.getInitialNotification();
  }

  disconnect() {
    this.unregisterListeners();
  }

  registerListeners = () => {
    this.notificationListener = firebase.notifications().onNotification(this.onNotification);
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(this.onNotificationOpened);
    this.tokenRefreshListener = firebase.messaging().onTokenRefresh(this.onTokenRefresh);
  }

  unregisterListeners = () => {
    try {
      this.notificationListener();
      this.notificationOpenedListener();
      this.tokenRefreshListener();
    } catch (error) {
      //
    }
  }

  onNotification = (notification) => {
    if (PLATFORM === 'android') {
      notification.android.setChannelId(CHANNEL_ID);
    }

    firebase.notifications().displayNotification(notification);

    if (AppState.currentState === 'active') {
      this.notificationHandler(notification);
    }
  }

  onNotificationOpened = ({ notification }) => {
    this.notificationHandler(notification);
  }

  onTokenRefresh = (registrationToken) => {
    this.registrationTokenHandler && // eslint-disable-line
    this.registrationTokenHandler({ token: registrationToken });
  }

  checkPermission = async () => {
    try {
      const permission = await firebase.messaging().hasPermission();
      if (!permission) {
        await firebase.messaging().requestPermission();
      }

      await this.getRegistrationToken();
    } catch (error) {
      //
    }
  }

  getRegistrationToken = async () => {
    try {
      const registrationToken = await firebase.messaging().getToken();

      if (registrationToken) {
        this.registrationTokenHandler && // eslint-disable-line
        this.registrationTokenHandler({ token: registrationToken });
      }
    } catch (error) {
      //
    }
  }

  getInitialNotification = async () => {
    try {
      const { notification } = await firebase.notifications().getInitialNotification();
      this.notificationHandler(notification);
    } catch (error) {
      //
    }
  }

  notificationHandler = (notification) => {
    if (this.forHandler) {
      return;
    }

    this.forHandler = true;

    setTimeout(() => {
      this.forHandler = false;
    }, 1500);

    const { data: { jobId } } = notification;

    if (jobId) {
      this.notificationHandlerForJobs && // eslint-disable-line
      this.notificationHandlerForJobs(jobId);
    } else {
      this.notificationHandlerForAlerts && // eslint-disable-line
      this.notificationHandlerForAlerts();
    }
  }

  createNotificationChannel = () => {
    const notificationChannel = new firebase.notifications.Android.Channel(
      CHANNEL_ID,
      CHANNEL_NAME,
      firebase.notifications.Android.Importance.Max,
    ).setDescription(CHANNEL_DESCRIPTION);

    firebase.notifications().android.createChannel(notificationChannel);
  }

  scheduleNotification = async ({ id, title, body }, fireDate) => {
    try {
      const notification = new firebase.notifications.Notification()
        .setNotificationId(id)
        .setTitle(title)
        .setBody(body)
        .setData({ title, body })
        .android.setChannelId(CHANNEL_ID);

      await firebase.notifications().scheduleNotification(notification, { fireDate });
      return Promise.resolve(id);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  cancelNotification = async (id) => {
    try {
      await firebase.notifications().cancelNotification(id);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  setNotificationHandlerForJobs = (handler) => {
    this.notificationHandlerForJobs = handler;
  }

  setNotificationHandlerForAlerts = (handler) => {
    this.notificationHandlerForAlerts = handler;
  }
}

const pushNotifications = new PushNotifications();

export {
  pushNotifications,
};
