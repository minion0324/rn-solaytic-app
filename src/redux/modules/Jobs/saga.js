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
  GET_ALERTS,
  GET_ALERTS_BY_DATE,
  GET_ALERTS_BY_PAGE,
  actionCreators,
} from './actions';

export function* asyncGetJobs() {
  try {
    const fromDate = moment().startOf('month').format('YYYY-MM-DD');
    const toDate = moment().endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate, false);
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

    const { data } = yield call(apiGetJobs, fromDate, toDate, false);
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
    date, pageOfJobs, success, failure,
  } = payload;

  try {
    const fromDate = moment(date, DATE_FORMAT).startOf('month').format('YYYY-MM-DD');
    const toDate = moment(date, DATE_FORMAT).endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate, false, pageOfJobs);
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

export function* asyncGetAlerts() {
  try {
    const fromDate = moment().startOf('month').format('YYYY-MM-DD');
    const toDate = moment().endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate, true);
    yield put(actionCreators.getAlertsSuccess(data));

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

export function* asyncGetAlertsByDate({ payload }) {
  const {
    date, success, failure,
  } = payload;

  try {
    const fromDate = moment(date, DATE_FORMAT).startOf('month').format('YYYY-MM-DD');
    const toDate = moment(date, DATE_FORMAT).endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate, true);
    yield put(actionCreators.getAlertsByDateSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetAlertsByDate() {
  while (true) {
    const action = yield take(GET_ALERTS_BY_DATE);
    yield* asyncGetAlertsByDate(action);
  }
}

export function* asyncGetAlertsByPage({ payload }) {
  const {
    date, pageOfAlerts, success, failure,
  } = payload;

  try {
    const fromDate = moment(date, DATE_FORMAT).startOf('month').format('YYYY-MM-DD');
    const toDate = moment(date, DATE_FORMAT).endOf('month').format('YYYY-MM-DD');

    const { data } = yield call(apiGetJobs, fromDate, toDate, true, pageOfAlerts);
    yield put(actionCreators.getAlertsByPageSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchGetAlertsByPage() {
  while (true) {
    const action = yield take(GET_ALERTS_BY_PAGE);
    yield* asyncGetAlertsByPage(action);
  }
}

export function* fetchData() {
  try {
    const res = yield all([
      call(asyncGetJobs),
      call(asyncGetAlerts),
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
    fork(watchGetAlertsByDate),
    fork(watchGetAlertsByPage),
  ]);
}
