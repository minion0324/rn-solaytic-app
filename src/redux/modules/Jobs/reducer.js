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
  SET_FOCUSED_JOB,
  ACKNOWLEDGE_JOBS_SUCCESS,
} from './actions';

const DEFAULT = {
  //
};

const jobsPersistConfig = {
  key: 'Jobs',
  storage: AsyncStorage,
  blacklist: [
    'pageOfJobs',
    'countOfJobs',
    'allJobs',
    'dateForJobs',
    'pageOfAlerts',
    'countOfAlerts',
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
        draft.pageOfJobs = 1;
        draft.countOfJobs = payload.total;
        draft.allJobs = payload.data;
        draft.dateForJobs = payload.dateForJobs;
        break;
      case GET_JOBS_BY_PAGE_SUCCESS:
        draft.pageOfJobs = state.pageOfJobs + 1;
        draft.countOfJobs = state.countOfJobs + payload.total;
        draft.allJobs.push(payload.data);
        break;
      case GET_ALERTS_SUCCESS:
      case GET_ALERTS_BY_DATE_SUCCESS:
        draft.pageOfAlerts = 1;
        draft.countOfAlerts = payload.total;
        draft.allAlerts = payload.data;
        draft.dateForAlerts = payload.dateForAlerts;
        break;
      case GET_ALERTS_BY_PAGE_SUCCESS:
        draft.pageOfAlerts = state.pageOfAlerts + 1;
        draft.countOfAlerts = state.countOfAlerts + payload.total;
        draft.allAlerts.push(payload.data);
        break;
      case SET_FOCUSED_JOB:
        draft.focusedJob = payload;
        break;
      case ACKNOWLEDGE_JOBS_SUCCESS:
        draft.allJobs = payload.newJobs;
        draft.allAlerts = payload.newAlerts;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(jobsPersistConfig, Jobs);
