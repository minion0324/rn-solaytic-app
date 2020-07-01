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
} from 'src/services';
import {
  Jobs,
} from 'src/redux';
import {
  JOB_STATUS,
} from 'src/constants';

import {
  GET_JOBS_BY_DATE,
  GET_JOBS_BY_PAGE,
  GET_ALERTS_BY_DATE,
  GET_ALERTS_BY_PAGE,
  ACKNOWLEDGE_JOBS,
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

      if (dateForJobs === dateForAlerts) {
        const idx = res.newJobs.findIndex((item) => {
          return moment(item.jobDate).isAfter(res.newAlerts[index].jobDate);
        });

        res.newJobs.splice(idx, 0, {
          jobStatusId: 4,
          statusName: JOB_STATUS.ACKNOWLEDGE,
          ...res.newAlerts[index],
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
  ]);
}
