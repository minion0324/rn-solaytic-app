import { fork, all } from 'redux-saga/effects';

import { sagas } from '../modules';

export default function* rootSaga() {
  yield all(sagas.map(saga => fork(saga)));
};
