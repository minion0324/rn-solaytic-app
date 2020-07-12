import {
  take, put, call, fork, all, select,
} from 'redux-saga/effects';
import moment from 'moment';

import {
  getFormattedDate,
  getStartOfMonth,
  getEndOfMonth,
} from 'src/utils';
import {
  apiGetJobs,
  apiAcknowledgeJobs,
  apiStartJobs,
  apiExchangeJobs,
  apiCompleteJobs,
} from 'src/services';
import {
  Jobs,
} from 'src/redux';
import {
  JOB_DATE,
  JOB_STATUS,
} from 'src/constants';

import {
  GET_JOBS_BY_DATE,
  GET_JOBS_BY_PAGE,
  GET_ALERTS_BY_DATE,
  GET_ALERTS_BY_PAGE,
  ACKNOWLEDGE_JOBS,
  START_JOBS,
  EXCHANGE_JOBS,
  COMPLETE_JOBS,
  actionCreators,
} from './actions';

export function* asyncGetJobs() {
  try {
    const dateForJobs = getFormattedDate();

    const fromDate = getStartOfMonth(dateForJobs);
    const toDate = getEndOfMonth(dateForJobs);

    const { data } = yield call(apiGetJobs, fromDate, toDate, false);
    yield put(actionCreators.getJobsSuccess({ dateForJobs, ...data }));

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
    dateForJobs, success, failure,
  } = payload;

  try {
    const fromDate = getStartOfMonth(dateForJobs);
    const toDate = getEndOfMonth(dateForJobs);

    const { data } = yield call(apiGetJobs, fromDate, toDate, false);
    yield put(actionCreators.getJobsByDateSuccess({ dateForJobs, ...data }));

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
    dateForJobs, pageOfJobs, success, failure,
  } = payload;

  try {
    const fromDate = getStartOfMonth(dateForJobs);
    const toDate = getEndOfMonth(dateForJobs);

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
    const dateForAlerts = getFormattedDate();

    const fromDate = getStartOfMonth(dateForAlerts);
    const toDate = getEndOfMonth(dateForAlerts);

    const { data } = yield call(apiGetJobs, fromDate, toDate, true);
    yield put(actionCreators.getAlertsSuccess({ dateForAlerts, ...data }));

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
    dateForAlerts, success, failure,
  } = payload;

  try {
    const fromDate = getStartOfMonth(dateForAlerts);
    const toDate = getEndOfMonth(dateForAlerts);

    const { data } = yield call(apiGetJobs, fromDate, toDate, true);
    yield put(actionCreators.getAlertsByDateSuccess({ dateForAlerts, ...data }));

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
    dateForAlerts, pageOfAlerts, success, failure,
  } = payload;

  try {
    const fromDate = getStartOfMonth(dateForAlerts);
    const toDate = getEndOfMonth(dateForAlerts);

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

export function* asyncAcknowledgeJobs({ payload }) {
  const {
    jobIds, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiAcknowledgeJobs, jobIds);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);
    const allAlerts = yield select(Jobs.selectors.getAllAlerts);

    const dateForJobs = yield select(Jobs.selectors.getDateForJobs);
    const dateForAlerts = yield select(Jobs.selectors.getDateForAlerts);

    //
    const result = successJobIds.reduce((res, id) => {
      const index = res.newAlerts.findIndex(item => item.jobId === id);

      if (index === -1) {
        const idx = res.newJobs.findIndex(item => item.jobId === id);

        res.newJobs.splice(idx, 1, {
          ...res.newJobs[idx],
          jobStatusId: 4,
          statusName: JOB_STATUS.ACKNOWLEDGED,
        });

        return res;
      }

      if (dateForJobs === dateForAlerts) {
        const idx = res.newJobs.findIndex((item) => {
          return moment(item[JOB_DATE]).isAfter(res.newAlerts[index][JOB_DATE]);
        });

        res.newJobs.splice(idx, 0, {
          ...res.newAlerts[index],
          jobStatusId: 4,
          statusName: JOB_STATUS.ACKNOWLEDGED,
        });
      }
      res.newAlerts.splice(index, 1);

      return res;
    }, {
      newJobs: allJobs.slice(0),
      newAlerts: allAlerts.slice(0),
    });

    yield put(actionCreators.acknowledgeJobsSuccess(result));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchAcknowledgeJobs() {
  while (true) {
    const action = yield take(ACKNOWLEDGE_JOBS);
    yield* asyncAcknowledgeJobs(action);
  }
}

export function* asyncStartJobs({ payload }) {
  const {
    jobIds, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiStartJobs, jobIds);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      res.newJobs.splice(index, 1, {
        ...res.newJobs[index],
        jobStatusId: 5,
        statusName: JOB_STATUS.IN_PROGRESS1,
      });

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.startJobsSuccess(result));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchStartJobs() {
  while (true) {
    const action = yield take(START_JOBS);
    yield* asyncStartJobs(action);
  }
}

export function* asyncExchangeJobs({ payload }) {
  const {
    jobIds, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiExchangeJobs, jobIds);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      res.newJobs.splice(index, 1, {
        ...res.newJobs[index],
        jobStatusId: 6,
        statusName: JOB_STATUS.IN_PROGRESS2,
      });

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.exchangeJobsSuccess(result));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchExchangeJobs() {
  while (true) {
    const action = yield take(EXCHANGE_JOBS);
    yield* asyncExchangeJobs(action);
  }
}

export function* asyncCompleteJobs({ payload }) {
  const {
    jobIds, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiCompleteJobs, jobIds);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      res.newJobs.splice(index, 1, {
        ...res.newJobs[index],
        jobStatusId: 7,
        statusName: JOB_STATUS.COMPLETED,
      });

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.completeJobsSuccess(result));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchCompleteJobs() {
  while (true) {
    const action = yield take(COMPLETE_JOBS);
    yield* asyncCompleteJobs(action);
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
    fork(watchAcknowledgeJobs),
    fork(watchStartJobs),
    fork(watchExchangeJobs),
    fork(watchCompleteJobs),
  ]);
}
