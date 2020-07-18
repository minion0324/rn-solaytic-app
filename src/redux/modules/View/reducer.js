import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  SET_CORE_SCREEN_INFO,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_SIGN_SUCCESS,
  INIT_JOB_PHOTOS_AND_SIGN,
  GET_DRIVER_NOTES_SUCCESS,
} from './actions';

const DEFAULT = {
  //
};

const viewPersistConfig = {
  key: 'View',
  storage: AsyncStorage,
  blacklist: [
    'coreScreenInfo',
    'jobPhotos',
    'jobSign',
    'driverNotes',
  ],
};

function View(state = DEFAULT, action = {}) {
  /* eslint-disable */
  return produce(state, draft => {
    const { type, payload } = action;

    switch (type) {
      case SET_CORE_SCREEN_INFO:
        draft.coreScreenInfo = payload;
        break;
      case UPLOAD_PHOTOS_SUCCESS:
        draft.jobPhotos = payload;
        break;
      case UPLOAD_SIGN_SUCCESS:
        draft.jobSign = payload;
        break;
      case INIT_JOB_PHOTOS_AND_SIGN:
        draft.jobPhotos = [];
        draft.jobSign = '';
        break;
      case GET_DRIVER_NOTES_SUCCESS:
        draft.driverNotes = payload;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(viewPersistConfig, View);
