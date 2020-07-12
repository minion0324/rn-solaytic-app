// @flow
import {
  take, call, fork, all,
} from 'redux-saga/effects';

import * as User from './User';
import * as Jobs from './Jobs';
import * as View from './View';

const stores = {
  User,
  Jobs,
  View,
};

const {
  reducers, sagas, fetch,
} = Object.keys(stores).reduce(
  (res, key) => {
    const store = stores[key];

    res.reducers[key] = store.reducer;
    res.sagas.push(store.saga);

    if (store.fetchData) {
      res.fetch.push(store.fetchData);
    }

    return res;
  },
  {
    reducers: {},
    sagas: [],
    fetch: [],
  },
);

function* asyncFetch(action) {
  const {
    payload: { success, failure },
  } = action;

  try {
    const res = yield all(fetch.map(fetchData => call(fetchData)));

    const index = res.findIndex(item => item.type === 'error');
    if (index !== -1) {
      failure && failure();
      return;
    }

    success && success();
  } catch (error) {
    failure && failure();
  }
}

function* watchFetch() {
  while (true) {
    const action = yield take('FETCH_DATA');
    yield* asyncFetch(action);
  }
}

function* allFetch() {
  yield all([
    fork(watchFetch),
  ]);
}

sagas.push(allFetch);

export {
  reducers,
  sagas,

  User,
  Jobs,
  View as ViewStore,
};
