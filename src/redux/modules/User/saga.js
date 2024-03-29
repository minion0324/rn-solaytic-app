import {
  take, put, call, fork, all,
} from 'redux-saga/effects';
import DeviceInfo from 'react-native-device-info';

import {
  PLATFORM,
} from 'src/constants';
import {
  onError,
} from 'src/utils';
import {
  apiLogin,
  apiAuthToken,
  apiSetFCMToken,
  setAuthToken,
  removeAuthToken,
} from 'src/services';

import {
  LOGIN,
  AUTH_TOKEN,
  SET_FCM_TOKEN,
  actionCreators,
} from './actions';

export function* asyncLogin({ payload }) {
  const {
    userName,
    password,
    persistToken,
    success,
    failure,
  } = payload;

  try {
    removeAuthToken();

    const { data } = yield call(apiLogin, userName, password, persistToken);
    yield put(actionCreators.loginSuccess(data));

    setAuthToken(data.token);

    success && success();
  } catch (error) {
    yield onError(error);
    failure && failure();
  }
}

export function* watchLogin() {
  while (true) {
    const action = yield take(LOGIN);
    yield* asyncLogin(action);
  }
}

export function* asyncAuthToken({ payload }) {
  const {
    token, success, failure,
  } = payload;

  try {
    setAuthToken(token);

    const { data } = yield call(apiAuthToken);
    yield put(actionCreators.authTokenSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchAuthToken() {
  while (true) {
    const action = yield take(AUTH_TOKEN);
    yield* asyncAuthToken(action);
  }
}

export function* asyncSetFCMToken({ payload }) {
  const {
    token: deviceToken,
    success,
    failure,
  } = payload;

  try {
    const deviceType = PLATFORM === 'ios' ? 1 : 0;
    const deviceId = yield call(DeviceInfo.syncUniqueId);
    const deviceManufacturer = yield call(DeviceInfo.getManufacturer);
    const deviceModel = DeviceInfo.getDeviceId();
    const appVersion = DeviceInfo.getVersion();

    const { data } = yield call(apiSetFCMToken,
      deviceToken,
      deviceType,
      deviceId,
      deviceManufacturer,
      deviceModel,
      appVersion,
    );

    yield put(actionCreators.setFCMTokenSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchSetFCMToken() {
  while (true) {
    const action = yield take(SET_FCM_TOKEN);
    yield* asyncSetFCMToken(action);
  }
}

export function* fetchData() {
  try {
    const res = yield all([
      //
    ]);

    const index = res.findIndex(item => item.type === 'error');
    if (index !== -1) {
      return res[index];
    }

    return {
      type: 'success',
    };
  } catch (error) {
    return {
      type: 'error',
      error,
    };
  }
}

export default function* () {
  yield all([
    fork(watchLogin),
    fork(watchAuthToken),
    fork(watchSetFCMToken),
  ]);
}
