import {
  take, put, call, fork, all,
} from 'redux-saga/effects';

import {
  apiUploadFile,
  apiGetDriverNotes,
} from 'src/services';
import {
  PLATFORM,
} from 'src/constants';

import {
  UPLOAD_PHOTOS,
  UPLOAD_SIGN,
  GET_DRIVER_NOTES,
  actionCreators,
} from './actions';

export function* asyncUploadPhotos({ payload }) {
  const {
    photos, success, failure,
  } = payload;

  try {
    const response = yield all(
      photos.map(photo => call(apiUploadFile, photo))
    );
    const data = response.map(item => item.data);
    yield put(actionCreators.uploadPhotosSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchUploadPhotos() {
  while (true) {
    const action = yield take(UPLOAD_PHOTOS);
    yield* asyncUploadPhotos(action);
  }
}

export function* asyncUploadSign({ payload }) {
  const {
    sign, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiUploadFile, PLATFORM === 'ios' ? sign : 'file://' + sign);
    yield put(actionCreators.uploadSignSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchUploadSign() {
  while (true) {
    const action = yield take(UPLOAD_SIGN);
    yield* asyncUploadSign(action);
  }
}

export function* asyncGetDriverNotes({ payload }) {
  const {
    success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetDriverNotes);

    console.log(data);

    yield put(actionCreators.getDriverNotesSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetDriverNotes() {
  while (true) {
    const action = yield take(GET_DRIVER_NOTES);
    yield* asyncGetDriverNotes(action);
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
    fork(watchUploadPhotos),
    fork(watchUploadSign),
    fork(watchGetDriverNotes),
  ]);
}
