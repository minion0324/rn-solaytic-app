import { Alert } from 'react-native';
import { select } from 'redux-saga/effects';

import {
  ViewStore,
} from 'src/redux';

function* onError(error) {
  const isNetworkConnected = yield select(ViewStore.selectors.getIsNetworkConnected);

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
    message = 'Network problem. Please check your network connection.';
  }

  Alert.alert('Warning', message);
}

export {
  onError,
};
