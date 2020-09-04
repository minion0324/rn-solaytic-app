import { Alert } from 'react-native';
import { select } from 'redux-saga/effects';
import BackgroundFetch from 'react-native-background-fetch';
import RNRestart from 'react-native-restart';

import {
  ViewStore,
} from 'src/redux';
import {
  addItem,
  removeItem,
  getItems,
} from 'src/utils';
import {
  BACKGROUND_FETCH_KEY,
} from 'src/constants';

function* onError(error, backgroundFetch, fetchInfo) {
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
      ? 'The process goes into background mode. ' +
        'Please don\'t terminate the app. You can lost some data if you terminate the app.'
      : 'Please check your network connection.');

    if (backgroundFetch) {
      onBackgroundFetch(backgroundFetch, fetchInfo);
    }
  }

  Alert.alert('Warning', message);
}

async function onBackgroundFetch(backgroundFetch, fetchInfo) {
  try {
    const { api, params } = backgroundFetch;

    await addItem(BACKGROUND_FETCH_KEY, fetchInfo, params);

    const backgroundFetchHandler = async (taskId) => {
      console.log('----- background fetch handler');
      console.log(taskId);

      try {
        const fetchData = await getItems(BACKGROUND_FETCH_KEY);

        if (fetchData.length === 0) {
          BackgroundFetch.finish(taskId);
        }

        let count = 0;
        await Promise.all(
          fetchData.map(async (data) => {
            try {
              const { id, value } = data;
              await api(...value);
              await removeItem(BACKGROUND_FETCH_KEY, id);
              count++;
            } catch (e) {
              //
              console.log('----- e');
              console.log(e);
              console.log(e.response);
            }

            return Promise.resolve();
          })
        );

        if (!count) {
          return;
        }

        Alert.alert(
          'Alert',
          'The background process is completed. ' +
          'You need to restart the app to sync your data. Would you like to restart the app now?',
          [
            {
              text: 'Cancel',
            },
            {
              text: 'OK',
              onPress: () => RNRestart.Restart(),
            },
          ],
          { cancelable: false },
        );
      } catch (err) {
        console.log('----- err');
        console.log(err);
        console.log(err.response);
      }
    };

    const backgroundErrorHandler = (error) => {
      console.log('----- background error handler');
      console.log(error);
    };

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
      },
      backgroundFetchHandler,
      backgroundErrorHandler,
    );
  } catch (error) {
    //
  }
}

export {
  onError,
};
