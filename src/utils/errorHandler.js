import { Alert } from 'react-native';
import { select } from 'redux-saga/effects';
import BackgroundFetch from 'react-native-background-fetch';

import {
  ViewStore,
} from 'src/redux';

function* onError(error, backgroundFetch) {
  const isNetworkConnected = yield select(
    ViewStore.selectors.getIsNetworkConnected
  );

  let message = 'Something went wrong.';

  try {
    const responseData = error.response.data;
    if (typeof responseData === 'string') {
      message = responseData;
    }
  } catch (err) {
    //
  }

  if (!isNetworkConnected) {
    message = 'Network problem. ' +
      (backgroundFetch
      ? 'The process goes into background mode.'
      : 'Please check your network connection.');

    if (backgroundFetch) {
      onBackgroundFetch(backgroundFetch);
    }
  }

  Alert.alert('Warning', message);
}

function onBackgroundFetch(backgroundFetch) {
  const backgroundFetchHandler = async (taskId) => {
    console.log('----- background fetch handler');
    console.log(taskId);

    const { api, params } = backgroundFetch;

    await api(...params);

    BackgroundFetch.finish(taskId);
  };

  const backgroundErrorHandler = (error) => {
    console.log('----- background error handler');
    console.log(error);
  };

  BackgroundFetch.configure(
    {
      minimumFetchInterval: 1,

      // forceAlarmManager: false,
      // stopOnTerminate: false,
      // startOnBoot: true,

      // requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
      // requiresCharging: false,
      // requiresDeviceIdle: false,
      // requiresBatteryNotLow: false,
      // requiresStorageNotLow: false,
    },
    backgroundFetchHandler,
    backgroundErrorHandler,
  );
}

export {
  onError,
};
