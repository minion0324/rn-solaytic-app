import {
  take, put, call, fork, all,
} from 'redux-saga/effects';

import {
  apiGetDriverNotes,
  apiGetBinNumbers,
  apiGetJobDates,
  apiGetWasteTypes,
} from 'src/services';
import {
  onError,
} from 'src/utils';

import {
  GET_DRIVER_NOTES,
  GET_DRIVER_NOTES_BY_PAGE,
  GET_BIN_NUMBERS,
  GET_JOB_DATES,
  GET_WASTE_TYPES,
  GET_WASTE_TYPES_BY_PAGE,
  actionCreators,
} from './actions';

export function* asyncGetDriverNotes({ payload }) {
  const {
    search, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetDriverNotes, search);
    yield put(actionCreators.getDriverNotesSuccess(data));

    success && success();
  } catch (error) {
    yield onError(error);
    failure && failure();
  }
}

export function* watchGetDriverNotes() {
  while (true) {
    const action = yield take(GET_DRIVER_NOTES);
    yield* asyncGetDriverNotes(action);
  }
}

export function* asyncGetDriverNotesByPage({ payload }) {
  const {
    search, page, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetDriverNotes, search, page);
    yield put(actionCreators.getDriverNotesByPageSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetDriverNotesByPage() {
  while (true) {
    const action = yield take(GET_DRIVER_NOTES_BY_PAGE);
    yield* asyncGetDriverNotesByPage(action);
  }
}

export function* asyncGetBinNumbers({ payload }) {
  const {
    search, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetBinNumbers, search);
    yield put(actionCreators.getBinNumbersSuccess(data));

    success && success();
  } catch (error) {
    yield onError(error);
    failure && failure();
  }
}

export function* watchGetBinNumbers() {
  while (true) {
    const action = yield take(GET_BIN_NUMBERS);
    yield* asyncGetBinNumbers(action);
  }
}

export function* asyncGetJobDates({ payload }) {
  const {
    success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetJobDates);

    yield put(actionCreators.getJobDatesSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetJobDates() {
  while (true) {
    const action = yield take(GET_JOB_DATES);
    yield* asyncGetJobDates(action);
  }
}

export function* asyncGetWasteTypes({ payload }) {
  const {
    search, binTypeId, customerSiteId, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetWasteTypes, search, 1, binTypeId, customerSiteId);
    yield put(actionCreators.getWasteTypesSuccess(data));

    success && success();
  } catch (error) {
    yield onError(error);
    failure && failure();
  }
}

export function* watchGetWasteTypes() {
  while (true) {
    const action = yield take(GET_WASTE_TYPES);
    yield* asyncGetWasteTypes(action);
  }
}

export function* asyncGetWasteTypesByPage({ payload }) {
  const {
    search, page, binTypeId, customerSiteId, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetWasteTypes, search, page, binTypeId, customerSiteId);
    yield put(actionCreators.getWasteTypesByPageSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetWasteTypesByPage() {
  while (true) {
    const action = yield take(GET_WASTE_TYPES_BY_PAGE);
    yield* asyncGetWasteTypesByPage(action);
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
    fork(watchGetDriverNotes),
    fork(watchGetDriverNotesByPage),
    fork(watchGetBinNumbers),
    fork(watchGetJobDates),
    fork(watchGetWasteTypes),
    fork(watchGetWasteTypesByPage),
  ]);
}
