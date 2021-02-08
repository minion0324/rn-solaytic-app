import {
  take, put, call, fork, all, select,
} from 'redux-saga/effects';
import moment from 'moment';
import { sortBy } from 'lodash';

import {
  onError,
  getDate,
  getStartDate,
  getEndDate,
  getUpdatedBinInfo,
  getUpdatedServices,
  getCacheItemById,
} from 'src/utils';
import {
  apiGetJobs,
  apiAcknowledgeJobs,
  apiStartJobs,
  apiPullJobs,
  apiExchangeJobs,
  apiCompleteJobs,
  apiFailJobs,
  apiGetJobById,
  apiMarkMessagesAsRead,
  apiAddMessage,
  apiUpdateAmountCollected,
} from 'src/services';
import {
  Jobs,
} from 'src/redux';
import {
  DATE_KEY,
  MONTH_KEY,
  JOB_DATE,
  JOB_STATUS,
  JOB_DETAILS_KEY,
} from 'src/constants';

import {
  GET_JOBS_BY_DATE,
  GET_JOBS_BY_PAGE,
  GET_ALERTS_BY_DATE,
  GET_ALERTS_BY_PAGE,
  RELOAD_JOBS_AND_ALERTS,
  ACKNOWLEDGE_JOBS,
  START_JOBS,
  PULL_JOBS,
  EXCHANGE_JOBS,
  COMPLETE_JOBS,
  FAIL_JOBS,
  GET_JOB_BY_ID,
  MARK_MESSAGES_AS_READ,
  ADD_MESSAGE,
  UPDATE_AMOUNT_COLLECTED,
  actionCreators,
} from './actions';

export function* asyncGetJobs() {
  try {
    const dateForJobs = getDate();

    const startDate = getStartDate(dateForJobs, DATE_KEY);
    const endDate = getEndDate(dateForJobs, DATE_KEY);

    const { data } = yield call(apiGetJobs, startDate, endDate, false);
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
    const startDate = getStartDate(dateForJobs, DATE_KEY);
    const endDate = getEndDate(dateForJobs, DATE_KEY);

    const { data } = yield call(apiGetJobs, startDate, endDate, false);
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
    const startDate = getStartDate(dateForJobs, DATE_KEY);
    const endDate = getEndDate(dateForJobs, DATE_KEY);

    const { data } = yield call(apiGetJobs, startDate, endDate, false, pageOfJobs);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const newJobs = data.data.reduce((result, item) => {
      const index = result.findIndex(el => el.jobId === item.jobId);
      if (index === -1) {
        const idx = result.findIndex((el) => {
          return moment(el[JOB_DATE]).isAfter(item[JOB_DATE]);
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
    const dateForAlerts = getDate();

    const startDate = getStartDate(dateForAlerts, MONTH_KEY);
    const endDate = getEndDate(dateForAlerts, MONTH_KEY);

    const { data } = yield call(apiGetJobs, startDate, endDate, true);
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
    const startDate = getStartDate(dateForAlerts, MONTH_KEY);
    const endDate = getEndDate(dateForAlerts, MONTH_KEY);

    const { data } = yield call(apiGetJobs, startDate, endDate, true);
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
    const startDate = getStartDate(dateForAlerts, MONTH_KEY);
    const endDate = getEndDate(dateForAlerts, MONTH_KEY);

    const { data } = yield call(apiGetJobs, startDate, endDate, true, pageOfAlerts);

    const allAlerts = yield select(Jobs.selectors.getAllAlerts);

    const newAlerts = data.data.reduce((result, item) => {
      const index = result.findIndex(el => el.jobId === item.jobId);
      if (index === -1) {
        const idx = result.findIndex((el) => {
          return moment(el[JOB_DATE]).isAfter(item[JOB_DATE]);
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
    const date = getDate();

    const startDateForJobs = getStartDate(date, DATE_KEY);
    const endDateForJobs = getEndDate(date, DATE_KEY);

    const startDateForAlerts = getStartDate(date, MONTH_KEY);
    const endDateForAlerts = getEndDate(date, MONTH_KEY);

    const { data: { data: newJobs } } = yield call(apiGetJobs, startDateForJobs, endDateForJobs, false);
    const { data: { data: newAlerts } } = yield call(apiGetJobs, startDateForAlerts, endDateForAlerts, true);

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

    const focusedJobId = yield select(Jobs.selectors.getFocusedJobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);
    const allAlerts = yield select(Jobs.selectors.getAllAlerts);

    const dateForJobs = yield select(Jobs.selectors.getDateForJobs);

    //
    const result = successJobIds.reduce((res, id) => {
      const index = res.newAlerts.findIndex(item => item.jobId === id);

      if (index === -1) {
        const idx = res.newJobs.findIndex(item => item.jobId === id);

        if (idx === -1) {
          return res;
        }

        res.newJobs.splice(idx, 1, {
          ...res.newJobs[idx],
          statusName: JOB_STATUS.ACKNOWLEDGED,
        });

        return res;
      }

      const newItem = res.newAlerts[index];
      res.newAlerts.splice(index, 1);

      const idx = res.newJobs.findIndex(item => item.jobId === id);

      if (idx === -1) {
        if (dateForJobs === getDate(newItem[JOB_DATE])) {
          let orderIndex = res.newJobs.findIndex((item) => {
            return moment(item[JOB_DATE])
              .isAfter(moment(newItem[JOB_DATE]));
          });

          if (orderIndex === -1) {
            orderIndex = res.newJobs.length;
          }

          res.newJobs.splice(orderIndex, 0, {
            ...newItem,
            statusName: JOB_STATUS.ACKNOWLEDGED,
          });
        }
      } else {
        res.newJobs.splice(idx, 1, {
          ...res.newJobs[idx],
          statusName: JOB_STATUS.ACKNOWLEDGED,
        });
      }

      return res;
    }, {
      newJobs: allJobs.slice(0),
      newAlerts: allAlerts.slice(0),
    });

    yield put(actionCreators.acknowledgeJobsSuccess({
      ...result,
      statusName:
        successJobIds.includes(focusedJobId) && JOB_STATUS.ACKNOWLEDGED,
    }));

    try {
      const { data } = yield call(apiGetJobById, focusedJobId);

      //
      let steps = data.steps.slice(0);
      steps = sortBy(steps, 'stepOrder');

      yield put(actionCreators.getJobByIdSuccess({ ...data, steps }));
    } catch (err) {
      //
    }

    success && success();
  } catch (error) {
    yield onError(error);
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
    jobIds,
    binInfo,
    services,
    amountCollected,
    photos,
    sign,
    signedUserName,
    signedUserContact,
    success,
    failure,
  } = payload;

  try {
    const stepBinUpdate = getUpdatedBinInfo(binInfo);
    const pricings = getUpdatedServices(services);

    const focusedJob = yield select(Jobs.selectors.getFocusedJob);

    const lastJobStep = focusedJob.steps[focusedJob.steps.length - 1];

    const attempt = {
      jobStepId: lastJobStep.jobStepId,
      customerName: focusedJob.customer.customerName,
      amountCollected,
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
      base64Signature: sign.data,
      signatureFileName: (sign.uri || '').split('/').pop(),
      signedUserName,
      signedUserContact,
      driverName: '', //
      vehicleName: '', //
      remarks: focusedJob.remarks,
      jobPhotos: photos.map((photo) => {
        return {
          jobStepId: photo.jobStepId,
          base64Image: photo.data,
          fileName: (photo.uri || '').split('/').pop(),
          photoCaption: '', //
        }
      }),
    };

    const { data } = yield call(apiStartJobs,
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      attempt,
    );

    const successJobIds = data.successJobs.map(item => item.jobId);

    const focusedJobId = yield select(Jobs.selectors.getFocusedJobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      if (index !== -1) {
        res.newJobs.splice(index, 1, {
          ...res.newJobs[index],
          statusName: JOB_STATUS.STARTED,
        });
      }

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.startJobsSuccess({
      ...result,
      statusName:
        successJobIds.includes(focusedJobId) && JOB_STATUS.STARTED,
      appExtraData: { binInfo, services, amountCollected },
    }));

    try {
      const { data } = yield call(apiGetJobById, focusedJobId);

      //
      let steps = data.steps.slice(0);
      steps = sortBy(steps, 'stepOrder');

      yield put(actionCreators.getJobByIdSuccess({ ...data, steps }));
    } catch (err) {
      //
    }

    success && success();
  } catch (error) {
    yield onError(error);
    failure && failure();
  }
}

export function* watchStartJobs() {
  while (true) {
    const action = yield take(START_JOBS);
    yield* asyncStartJobs(action);
  }
}

export function* asyncPullJobs({ payload }) {
  const {
    jobIds,
    binInfo,
    services,
    amountCollected,
    photos,
    sign,
    signedUserName,
    signedUserContact,
    success,
    failure,
  } = payload;

  try {
    const stepBinUpdate = getUpdatedBinInfo(binInfo);
    const pricings = getUpdatedServices(services);

    const focusedJob = yield select(Jobs.selectors.getFocusedJob);

    const lastJobStep = focusedJob.steps[focusedJob.steps.length - 1];

    const attempt = {
      jobStepId: lastJobStep.jobStepId,
      customerName: focusedJob.customer.customerName,
      amountCollected,
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
      base64Signature: sign.data,
      signatureFileName: (sign.uri || '').split('/').pop(),
      signedUserName,
      signedUserContact,
      driverName: '', //
      vehicleName: '', //
      remarks: focusedJob.remarks,
      jobPhotos: photos.map((photo) => {
        return {
          jobStepId: photo.jobStepId,
          base64Image: photo.data,
          fileName: (photo.uri || '').split('/').pop(),
          photoCaption: '', //
        }
      }),
    };

    const { data } = yield call(apiPullJobs,
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      attempt,
    );

    const successJobIds = data.successJobs.map(item => item.jobId);

    const focusedJobId = yield select(Jobs.selectors.getFocusedJobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      if (index !== -1) {
        res.newJobs.splice(index, 1, {
          ...res.newJobs[index],
          statusName: JOB_STATUS.IN_PROGRESS,
        });
      }

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.pullJobsSuccess({
      ...result,
      statusName:
        successJobIds.includes(focusedJobId) && JOB_STATUS.IN_PROGRESS,
      appExtraData: { binInfo, services, amountCollected },
    }));

    try {
      const { data } = yield call(apiGetJobById, focusedJobId);

      //
      let steps = data.steps.slice(0);
      steps = sortBy(steps, 'stepOrder');

      yield put(actionCreators.getJobByIdSuccess({ ...data, steps }));
    } catch (err) {
      //
    }

    success && success();
  } catch (error) {
    yield onError(error);
    failure && failure();
  }
}

export function* watchPullJobs() {
  while (true) {
    const action = yield take(PULL_JOBS);
    yield* asyncPullJobs(action);
  }
}

export function* asyncExchangeJobs({ payload }) {
  const {
    jobIds,
    binInfo,
    services,
    amountCollected,
    photos,
    sign,
    signedUserName,
    signedUserContact,
    success,
    failure,
  } = payload;

  try {
    const stepBinUpdate = getUpdatedBinInfo(binInfo);
    const pricings = getUpdatedServices(services);

    const focusedJob = yield select(Jobs.selectors.getFocusedJob);

    const lastJobStep = focusedJob.steps[focusedJob.steps.length - 1];

    const attempt = {
      jobStepId: lastJobStep.jobStepId,
      customerName: focusedJob.customer.customerName,
      amountCollected,
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
      base64Signature: sign.data,
      signatureFileName: (sign.uri || '').split('/').pop(),
      signedUserName,
      signedUserContact,
      driverName: '', //
      vehicleName: '', //
      remarks: focusedJob.remarks,
      jobPhotos: photos.map((photo) => {
        return {
          jobStepId: photo.jobStepId,
          base64Image: photo.data,
          fileName: (photo.uri || '').split('/').pop(),
          photoCaption: '', //
        }
      }),
    };

    const { data } = yield call(apiExchangeJobs,
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      attempt,
    );

    const successJobIds = data.successJobs.map(item => item.jobId);

    const focusedJobId = yield select(Jobs.selectors.getFocusedJobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      if (index !== -1) {
        res.newJobs.splice(index, 1, {
          ...res.newJobs[index],
          statusName: JOB_STATUS.IN_PROGRESS,
        });
      }

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.exchangeJobsSuccess({
      ...result,
      statusName:
        successJobIds.includes(focusedJobId) && JOB_STATUS.IN_PROGRESS,
      appExtraData: { binInfo, services, amountCollected },
    }));

    try {
      const { data } = yield call(apiGetJobById, focusedJobId);

      //
      let steps = data.steps.slice(0);
      steps = sortBy(steps, 'stepOrder');

      yield put(actionCreators.getJobByIdSuccess({ ...data, steps }));
    } catch (err) {
      //
    }

    success && success();
  } catch (error) {
    yield onError(error);
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
    binInfo,
    services,
    amountCollected,
    photos,
    sign,
    signedUserName,
    signedUserContact,
    attempt: attemptData,
    success,
    failure,
  } = payload;

  let focusedJob = null;
  let attempt = attemptData;

  try {
    const stepBinUpdate = getUpdatedBinInfo(binInfo);
    const pricings = getUpdatedServices(services);

    focusedJob = yield select(Jobs.selectors.getFocusedJob);

    if (!attempt) {
      const lastJobStep = focusedJob.steps[focusedJob.steps.length - 1];

      attempt = {
        jobStepId: lastJobStep.jobStepId,
        customerName: focusedJob.customer.customerName,
        amountCollected,
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
        base64Signature: sign.data,
        signatureFileName: (sign.uri || '').split('/').pop(),
        signedUserName,
        signedUserContact,
        driverName: '', //
        vehicleName: '', //
        remarks: focusedJob.remarks,
        jobPhotos: photos.map((photo) => {
          return {
            jobStepId: photo.jobStepId,
            base64Image: photo.data,
            fileName: (photo.uri || '').split('/').pop(),
            photoCaption: '', //
          }
        }),
      };
    }

    const { data } = yield call(apiCompleteJobs,
      jobIds,
      stepBinUpdate,
      pricings,
      amountCollected,
      attempt,
    );

    const successJobIds = data.successJobs.map(item => item.jobId);

    const allJobs = yield select(Jobs.selectors.getAllJobs);

    const result = successJobIds.reduce((res, id) => {
      const index = res.newJobs.findIndex(item => item.jobId === id);

      if (index !== -1) {
        res.newJobs.splice(index, 1, {
          ...res.newJobs[index],
          statusName: JOB_STATUS.COMPLETED,
        });
      }

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.completeJobsSuccess({
      ...result,
      statusName:
        successJobIds.includes(focusedJob.jobId) && JOB_STATUS.COMPLETED,
      appExtraData: { binInfo, services, amountCollected },
    }));

    try {
      const { data } = yield call(apiGetJobById, focusedJob.jobId);

      //
      let steps = data.steps.slice(0);
      steps = sortBy(steps, 'stepOrder');

      yield put(actionCreators.getJobByIdSuccess({ ...data, steps }));
    } catch (err) {
      //
    }

    success && success();
  } catch (error) {
    yield onError(
      error,
      {
        jobId: focusedJob.jobId,
        jobNumber: focusedJob.jobNumber,
      },
      [
        jobIds, binInfo, services, amountCollected, attempt,
      ],
    );
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
      amountCollected: focusedJob.collectedAmount || focusedJob.amountToCollect,
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

      if (index !== -1) {
        res.newJobs.splice(index, 1, {
          ...res.newJobs[index],
          statusName: JOB_STATUS.FAILED,
        });
      }

      return res;
    }, {
      newJobs: allJobs.slice(0),
    });

    yield put(actionCreators.failJobsSuccess({
      ...result,
      statusName:
        successJobIds.includes(focusedJob.jobId) && JOB_STATUS.FAILED,
    }));

    success && success();
  } catch (error) {
    yield onError(error);
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
    const item = yield call(getCacheItemById, JOB_DETAILS_KEY, { jobId });

    if (item && item.value) {
      yield put(actionCreators.getJobByIdSuccess(item.value));
      success && success();
    } else {
      yield onError(error);
      failure && failure();
    }
  }
}

export function* watchGetJobById() {
  while (true) {
    const action = yield take(GET_JOB_BY_ID);
    yield* asyncGetJobById(action);
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
    yield onError(error);
    failure && failure();
  }
}

export function* watchAddMessage() {
  while (true) {
    const action = yield take(ADD_MESSAGE);
    yield* asyncAddMessage(action);
  }
}

export function* asyncUpdateAmountCollected({ payload }) {
  const {
    jobIds, amountCollected, success, failure,
  } = payload;

  try {
    const attempt = {
      amountCollected,
    };

    yield call(apiUpdateAmountCollected, jobIds, attempt);

    yield put(actionCreators.updateAmountCollectedSuccess(amountCollected));

    success && success();
  } catch (error) {
    yield onError(error);
    failure && failure();
  }
}

export function* watchUpdateAmountCollected() {
  while (true) {
    const action = yield take(UPDATE_AMOUNT_COLLECTED);
    yield* asyncUpdateAmountCollected(action);
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
    fork(watchPullJobs),
    fork(watchExchangeJobs),
    fork(watchCompleteJobs),
    fork(watchFailJobs),
    fork(watchGetJobById),
    fork(watchMarkMessagesAsRead),
    fork(watchAddMessage),
    fork(watchUpdateAmountCollected),
  ]);
}
