import {
  take, put, call, fork, all,
} from 'redux-saga/effects';
import moment from 'moment';

import {
  apiGetJobs,
} from 'src/services';
import {
  DATE_FORMAT,
} from 'src/constants';

import {
  GET_JOBS,
  GET_JOBS_BY_DATE,
  GET_JOBS_BY_PAGE,
  actionCreators,
} from './actions';

export function* asyncGetJobs() {
  try {
    const fromDate = moment().startOf('month').format('YYYY-MM-DD');
    const toDate = moment().endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate);
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

export function* asyncGetJobsByDate({ payload }) {
  const {
    date, success, failure,
  } = payload;

  try {
    const fromDate = moment(date, DATE_FORMAT).startOf('month').format('YYYY-MM-DD');
    const toDate = moment(date, DATE_FORMAT).endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate);
    yield put(actionCreators.getJobsByDateSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetJobsByDate() {
  while (true) {
    const action = yield take(GET_JOBS_BY_DATE);
    yield* asyncGetJobsByDate(action);
  }
}

export function* asyncGetJobsByPage({ payload }) {
  const {
    date, pageIndex, success, failure,
  } = payload;

  try {
    const fromDate = moment(date, DATE_FORMAT).startOf('month').format('YYYY-MM-DD');
    const toDate = moment(date, DATE_FORMAT).endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate, pageIndex);
    yield put(actionCreators.getJobsByPageSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetJobsByPage() {
  while (true) {
    const action = yield take(GET_JOBS_BY_PAGE);
    yield* asyncGetJobsByPage(action);
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
    fork(watchGetJobsByDate),
    fork(watchGetJobsByPage),
  ]);
}
