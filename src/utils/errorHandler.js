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
  console.log('----- background fetch content');
  console.log(backgroundFetch);

  const backgroundFetchHandler = async (taskId) => {
    console.log('----- background fetch handler');
    console.log(taskId);

    try {
      const { api, params } = backgroundFetch;

      await api(...params);

      BackgroundFetch.finish(taskId);
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
}

export {
  onError,
};
