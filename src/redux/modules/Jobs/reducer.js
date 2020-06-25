import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  GET_JOBS_SUCCESS,
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
        draft.jobs = payload.data;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(jobsPersistConfig, Jobs);
