import {
  take, put, call, fork, all,
} from 'redux-saga/effects';

import {
  apiLogin,
  apiAuthToken,
  setAuthToken,
  removeAuthToken,
} from 'src/services';

import {
  LOGIN,
  AUTH_TOKEN,
  actionCreators,
} from './actions';

export function* asyncLogin({ payload }) {
  const {
    userName, password, success, failure,
  } = payload;

  try {
    removeAuthToken();

    const { data } = yield call(apiLogin, userName, password);
    yield put(actionCreators.loginSuccess(data));

    setAuthToken(data.token);

    success && success();
  } catch (error) {
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

    const { data } = yield call(apiAuthToken, token);
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
  ]);
}
