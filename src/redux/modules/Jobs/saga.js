import {
  take, put, call, fork, all,
} from 'redux-saga/effects';

import {
  apiGetJobs,
} from 'src/services';

import {
  GET_JOBS,
  actionCreators,
} from './actions';

export function* asyncGetJobs() {
  try {
    const { data } = yield call(apiGetJobs);
    yield put(actionCreators.getJobsSuccess(data));

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

export function* fetchData() {
  try {
    const res = yield all([
      call(asyncGetJobs),
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
    //
  ]);
}
