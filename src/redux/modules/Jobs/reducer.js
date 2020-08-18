import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  GET_JOBS_SUCCESS,
  GET_JOBS_BY_DATE_SUCCESS,
  GET_JOBS_BY_PAGE_SUCCESS,
  GET_ALERTS_SUCCESS,
  GET_ALERTS_BY_DATE_SUCCESS,
  GET_ALERTS_BY_PAGE_SUCCESS,
  RELOAD_JOBS_AND_ALERTS_SUCCESS,
  ACKNOWLEDGE_JOBS_SUCCESS,
  START_JOBS_SUCCESS,
  EXCHANGE_JOBS_SUCCESS,
  COMPLETE_JOBS_SUCCESS,
  FAIL_JOBS_SUCCESS,
  GET_JOB_BY_ID_SUCCESS,
  ADD_SERVICE_SUCCESS,
  REMOVE_SERVICE_SUCCESS,
  MARK_MESSAGES_AS_READ_SUCCESS,
  ADD_MESSAGE_SUCCESS,
  UPDATE_AMOUNT_COLLECTED_SUCCESS,
} from './actions';

const DEFAULT = {
  //
};

const jobsPersistConfig = {
  key: 'Jobs',
  storage: AsyncStorage,
  blacklist: [
    'allJobs',
    'dateForJobs',
    'allAlerts',
    'dateForAlerts',
    'focusedJob',
  ],
};

function Jobs(state = DEFAULT, action = {}) {
  /* eslint-disable */
  return produce(state, draft => {
    const { type, payload } = action;

    switch (type) {
      case GET_JOBS_SUCCESS:
      case GET_JOBS_BY_DATE_SUCCESS:
        draft.allJobs = payload.data;
        draft.dateForJobs = payload.dateForJobs;
        break;
      case GET_JOBS_BY_PAGE_SUCCESS:
        draft.allJobs = payload;
        break;
      case GET_ALERTS_SUCCESS:
      case GET_ALERTS_BY_DATE_SUCCESS:
        draft.allAlerts = payload.data;
        draft.dateForAlerts = payload.dateForAlerts;
        break;
      case GET_ALERTS_BY_PAGE_SUCCESS:
        draft.allAlerts = payload;
        break;
      case RELOAD_JOBS_AND_ALERTS_SUCCESS:
        draft.allJobs = payload.newJobs;
        draft.allAlerts = payload.newAlerts;
        draft.dateForJobs = payload.date;
        draft.dateForAlerts = payload.date;
        break;
      case ACKNOWLEDGE_JOBS_SUCCESS:
        draft.allJobs = payload.newJobs;
        draft.allAlerts = payload.newAlerts;
        break;
      case START_JOBS_SUCCESS:
      case EXCHANGE_JOBS_SUCCESS:
      case COMPLETE_JOBS_SUCCESS:
      case FAIL_JOBS_SUCCESS:
        draft.allJobs = payload.newJobs;
        break;
      case GET_JOB_BY_ID_SUCCESS:
        draft.focusedJob = payload;
        break;
      case ADD_SERVICE_SUCCESS:
      case REMOVE_SERVICE_SUCCESS:
        draft.focusedJob.additionalCharges = payload;
        break;
      case MARK_MESSAGES_AS_READ_SUCCESS:
        draft.focusedJob.haveUnreadMessage = false;
        break;
      case ADD_MESSAGE_SUCCESS:
        draft.focusedJob.messages.push(payload);
        break;
      case UPDATE_AMOUNT_COLLECTED_SUCCESS:
        draft.focusedJob.collectedAmount = payload;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(jobsPersistConfig, Jobs);
