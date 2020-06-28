import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  GET_JOBS_SUCCESS,
  GET_JOBS_BY_DATE_SUCCESS,
  GET_JOBS_BY_PAGE_SUCCESS,
} from './actions';

const DEFAULT = {
  //
};

const jobsPersistConfig = {
  key: 'Jobs',
  storage: AsyncStorage,
  blacklist: [
    //
  ],
};

function Jobs(state = DEFAULT, action = {}) {
  /* eslint-disable */
  return produce(state, draft => {
    const { type, payload } = action;

    switch (type) {
      case GET_JOBS_SUCCESS:
      case GET_JOBS_BY_DATE_SUCCESS:
        draft.pageIndex = 1;
        draft.count = payload.total;
        draft.jobs = payload.data;
        break;
      case GET_JOBS_BY_PAGE_SUCCESS:
        draft.pageIndex = state.pageIndex + 1;
        draft.count = state.counnt + payload.total;
        draft.jobs.push(payload.data);
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(jobsPersistConfig, Jobs);
