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
  SET_FOCUSED_JOB_ID,
  ACKNOWLEDGE_JOBS_SUCCESS,
  START_JOBS_SUCCESS,
  EXCHANGE_JOBS_SUCCESS,
  COMPLETE_JOBS_SUCCESS,
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
    'focusedJobId',
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
        draft.allJobs.push(payload.data);
        break;
      case GET_ALERTS_SUCCESS:
      case GET_ALERTS_BY_DATE_SUCCESS:
        draft.allAlerts = payload.data;
        draft.dateForAlerts = payload.dateForAlerts;
        break;
      case GET_ALERTS_BY_PAGE_SUCCESS:
        draft.allAlerts.push(payload.data);
        break;
      case SET_FOCUSED_JOB_ID:
        draft.focusedJobId = payload;
        break;
      case ACKNOWLEDGE_JOBS_SUCCESS:
        draft.allJobs = payload.newJobs;
        draft.allAlerts = payload.newAlerts;
        break;
      case START_JOBS_SUCCESS:
      case EXCHANGE_JOBS_SUCCESS:
      case COMPLETE_JOBS_SUCCESS:
        draft.allJobs = payload.newJobs;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(jobsPersistConfig, Jobs);
