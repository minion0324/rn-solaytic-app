import {
  take, put, call, fork, all, select,
} from 'redux-saga/effects';
import moment from 'moment';
import { sortBy } from 'lodash';

import {
  onError,
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
  apiFailJobs,
  apiGetJobById,
  apiAddService,
  apiRemoveService,
  apiMarkMessagesAsRead,
  apiAddMessage,
} from 'src/services';
import {
  Jobs,
  ViewStore,
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
  RELOAD_JOBS_AND_ALERTS,
  ACKNOWLEDGE_JOBS,
  START_JOBS,
  EXCHANGE_JOBS,
  COMPLETE_JOBS,
  FAIL_JOBS,
  GET_JOB_BY_ID,
  ADD_SERVICE,
  REMOVE_SERVICE,
  MARK_MESSAGES_AS_READ,
  ADD_MESSAGE,
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

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const newJobs = data.data.reduce((result, item) => {
      const index = result.findIndex(el => el.jobId === item.jobId);
      if (index === -1) {
        const idx = result.findIndex((el) => {
          return moment(el[JOB_DATE[0]]).isAfter(item[JOB_DATE[0]]);
        });

        if (idx === -1) {
          result.push(item);
        } else {
          result.splice(idx, 0, item);
        }
      }

      return result;
    }, allJobs.slice(0));

    yield put(actionCreators.getJobsByPageSuccess(newJobs));

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

    const allAlerts = yield select(Jobs.selectors.getAllAlerts);

    const newAlerts = data.data.reduce((result, item) => {
      const index = result.findIndex(el => el.jobId === item.jobId);
      if (index === -1) {
        const idx = result.findIndex((el) => {
          return moment(el[JOB_DATE[0]]).isAfter(item[JOB_DATE[0]]);
        });

        if (idx === -1) {
          result.push(item);
        } else {
          result.splice(idx, 0, item);
        }
      }

      return result;
    }, allAlerts.slice(0));

    yield put(actionCreators.getAlertsByPageSuccess(newAlerts));

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

export function* asyncReloadJobsAndAlerts({ payload }) {
  const {
    success, failure,
  } = payload;

  try {
    const date = getFormattedDate();
    const fromDate = getStartOfMonth(date);
    const toDate = getEndOfMonth(date);

    const { data: { data: newJobs } } = yield call(apiGetJobs, fromDate, toDate, false);
    const { data: { data: newAlerts } } = yield call(apiGetJobs, fromDate, toDate, true);

    yield put(actionCreators.reloadJobsAndAlertsSuccess({ date, newJobs, newAlerts }));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchReloadJobsAndAlerts() {
  while (true) {
    const action = yield take(RELOAD_JOBS_AND_ALERTS);
    yield* asyncReloadJobsAndAlerts(action);
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
          statusName: JOB_STATUS.ACKNOWLEDGED,
        });

        return res;
      }

      if (dateForJobs === dateForAlerts) {
        let idx = res.newJobs.findIndex((item) => {
          return moment(item[JOB_DATE[0]]).isAfter(moment(res.newAlerts[index][JOB_DATE[0]]));
        });

        if (idx === -1) {
          idx = res.newJobs.length;
        }

        res.newJobs.splice(idx, 0, {
          ...res.newAlerts[index],
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
    onError(error);
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
    jobIds, stepBinUpdate, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiStartJobs, jobIds, stepBinUpdate);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      res.newJobs.splice(index, 1, {
        ...res.newJobs[index],
        statusName: JOB_STATUS.IN_PROGRESS1,
      });

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.startJobsSuccess(result));

    success && success();
  } catch (error) {
    onError(error);
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
    jobIds, stepBinUpdate, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiExchangeJobs, jobIds, stepBinUpdate);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      res.newJobs.splice(index, 1, {
        ...res.newJobs[index],
        statusName: JOB_STATUS.IN_PROGRESS2,
      });

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.exchangeJobsSuccess(result));

    success && success();
  } catch (error) {
    onError(error);
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
    jobIds,
    stepBinUpdate,
    signedUserName,
    signedUserContact,
    success,
    failure,
  } = payload;

  try {
    const focusedJob = yield select(Jobs.selectors.getFocusedJob);
    const jobPhotos = yield select(ViewStore.selectors.getJobPhotos);
    const jobSign = yield select(ViewStore.selectors.getJobSign);

    const lastJobStep = focusedJob.steps[focusedJob.steps.length - 1];

    const attempt = {
      jobStepId: lastJobStep.jobStepId,
      customerName: focusedJob.customer.customerName,
      amountCollected: lastJobStep.amountToCollect,
      siteName: lastJobStep.siteName,
      address: lastJobStep.address,
      wasteTypeId: focusedJob.steps[0].wasteTypeId,
      binTypeId: focusedJob.steps[0].binTypeId,
      binNumber: focusedJob.steps[0].binNumber,
      binWeight: focusedJob.steps[0].binWeight,
      wasteType2Id: focusedJob.steps[1].wasteTypeId,
      binType2Id: focusedJob.steps[1].binTypeId,
      binNumber2: focusedJob.steps[1].binNumber,
      binWeight2: focusedJob.steps[1].binWeight,
      submittedLat: lastJobStep.latitude,
      submittedLng: lastJobStep.longitude,
      submittedLocation: '', //
      signatureUrl: jobSign,
      signedUserName,
      signedUserContact,
      driverName: '', //
      vehicleName: '', //
      remarks: focusedJob.remarks,
      jobPhotos: jobPhotos.map((photo) => {
        return {
          jobStepId: lastJobStep.jobStepId,
          photoUrl: photo,
          photoCaption: '', //
        }
      }),
    };

    const { data } = yield call(apiCompleteJobs, jobIds, stepBinUpdate, attempt);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      res.newJobs.splice(index, 1, {
        ...res.newJobs[index],
        statusName: JOB_STATUS.COMPLETED,
      });

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.completeJobsSuccess(result));

    success && success();
  } catch (error) {
    onError(error);
    failure && failure();
  }
}

export function* watchCompleteJobs() {
  while (true) {
    const action = yield take(COMPLETE_JOBS);
    yield* asyncCompleteJobs(action);
  }
}

export function* asyncFailJobs({ payload }) {
  const {
    jobIds, driverNote, success, failure,
  } = payload;

  try {
    const focusedJob = yield select(Jobs.selectors.getFocusedJob);

    const lastJobStep = focusedJob.steps[focusedJob.steps.length - 1];

    const attempt = {
      jobStepId: lastJobStep.jobStepId,
      customerName: focusedJob.customer.customerName,
      amountCollected: lastJobStep.amountToCollect,
      siteName: lastJobStep.siteName,
      address: lastJobStep.address,
      wasteTypeId: focusedJob.steps[0].wasteTypeId,
      binTypeId: focusedJob.steps[0].binTypeId,
      binNumber: focusedJob.steps[0].binNumber,
      binWeight: focusedJob.steps[0].binWeight,
      wasteType2Id: focusedJob.steps[1].wasteTypeId,
      binType2Id: focusedJob.steps[1].binTypeId,
      binNumber2: focusedJob.steps[1].binNumber,
      binWeight2: focusedJob.steps[1].binWeight,
      submittedLat: lastJobStep.latitude,
      submittedLng: lastJobStep.longitude,
      submittedLocation: '', //
      driverName: '', //
      vehicleName: '', //
      remarks: driverNote,
    };

    const { data } = yield call(apiFailJobs, jobIds, attempt);

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      res.newJobs.splice(index, 1, {
        ...res.newJobs[index],
        statusName: JOB_STATUS.FAILED,
      });

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.failJobsSuccess(result));

    success && success();
  } catch (error) {
    onError(error);
    failure && failure();
  }
}

export function* watchFailJobs() {
  while (true) {
    const action = yield take(FAIL_JOBS);
    yield* asyncFailJobs(action);
  }
}

export function* asyncGetJobById({ payload }) {
  const {
    jobId, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiGetJobById, jobId);

    //
    let steps = data.steps.slice(0);
    steps = sortBy(steps, 'stepOrder');

    yield put(actionCreators.getJobByIdSuccess({ ...data, steps }));

    success && success();
  } catch (error) {
    onError(error);
    failure && failure();
  }
}

export function* watchGetJobById() {
  while (true) {
    const action = yield take(GET_JOB_BY_ID);
    yield* asyncGetJobById(action);
  }
}

export function* asyncAddService({ payload }) {
  const {
    jobId, serviceId, success, failure,
  } = payload;

  try {
    yield call(apiAddService, jobId, serviceId);

    const focusedJob = yield select(Jobs.selectors.getFocusedJob);
    const services = focusedJob.additionalCharges.slice(0);

    const index = services.findIndex((item) => {
      return item.serviceAdditionalChargeTemplateId === serviceId;
    });

    services[index] = {
      ...services[index],
      isSelected: true,
    };

    yield put(actionCreators.addServiceSuccess(services));

    success && success();
  } catch (error) {
    onError(error);
    failure && failure();
  }
}

export function* watchAddService() {
  while (true) {
    const action = yield take(ADD_SERVICE);
    yield* asyncAddService(action);
  }
}

export function* asyncRemoveService({ payload }) {
  const {
    jobId, serviceId, success, failure,
  } = payload;

  try {
    yield call(apiRemoveService, jobId, serviceId);

    const focusedJob = yield select(Jobs.selectors.getFocusedJob);
    const services = focusedJob.additionalCharges.slice(0);

    const index = services.findIndex((item) => {
      return item.serviceAdditionalChargeTemplateId === serviceId;
    });

    services[index] = {
      ...services[index],
      isSelected: false,
    };

    yield put(actionCreators.removeServiceSuccess(services));

    success && success();
  } catch (error) {
    onError(error);
    failure && failure();
  }
}

export function* watchRemoveService() {
  while (true) {
    const action = yield take(REMOVE_SERVICE);
    yield* asyncRemoveService(action);
  }
}

export function* asyncMarkMessagesAsRead({ payload }) {
  const {
    jobId, success, failure,
  } = payload;

  try {
    yield call(apiMarkMessagesAsRead, jobId);

    yield put(actionCreators.markMessagesAsReadSuccess());

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchMarkMessagesAsRead() {
  while (true) {
    const action = yield take(MARK_MESSAGES_AS_READ);
    yield* asyncMarkMessagesAsRead(action);
  }
}

export function* asyncAddMessage({ payload }) {
  const {
    jobId, message, success, failure,
  } = payload;

  try {
    const { data } = yield call(apiAddMessage, jobId, message);

    yield put(actionCreators.addMessageSuccess(data));

    success && success();
  } catch (error) {
    failure && failure();
  }
}

export function* watchAddMessage() {
  while (true) {
    const action = yield take(ADD_MESSAGE);
    yield* asyncAddMessage(action);
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
    fork(watchReloadJobsAndAlerts),
    fork(watchAcknowledgeJobs),
    fork(watchStartJobs),
    fork(watchExchangeJobs),
    fork(watchCompleteJobs),
    fork(watchFailJobs),
    fork(watchGetJobById),
    fork(watchAddService),
    fork(watchRemoveService),
    fork(watchMarkMessagesAsRead),
    fork(watchAddMessage),
  ]);
}
