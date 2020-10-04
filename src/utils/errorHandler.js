import { Alert } from 'react-native';
import { select } from 'redux-saga/effects';

import {
  User,
  ViewStore,
} from 'src/redux';
import {
  backgroundFetch,
} from 'src/utils';

export function* onError(error, fetchInfo, fetchData) {
  let message = 'Something went wrong.';

  const token = yield select(User.selectors.getToken);
  const isNetworkConnected = yield select(
    ViewStore.selectors.getIsNetworkConnected
  );

  try {
    const responseData = error.response.data;

    if (typeof responseData === 'string') {
      message = responseData;
    }

    if (
      typeof responseData === 'object' &&
      typeof responseData.Error === 'string'
    ) {
      message = responseData.Error;
    }
  } catch (err) {
    //
  }

  if (!error.response || !isNetworkConnected) {
    message = fetchInfo && fetchData
      ? 'Network problem. This job goes into background mode.'
      : 'Network problem. Please check your network connection.';

    if (fetchInfo && fetchData) {
      backgroundFetch(token, fetchInfo, fetchData);
    }
  }

  Alert.alert('Warning', message);
};
