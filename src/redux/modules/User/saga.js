import {
  take, put, call, fork, all,
} from 'redux-saga/effects';

import {
  apiLogin,
  removeAuthToken,
} from 'src/services';

import {
  LOGIN,
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
  ]);
}
