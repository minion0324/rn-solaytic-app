import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  SET_CORE_SCREEN_INFO,
  GET_DRIVER_NOTES_SUCCESS,
  GET_DRIVER_NOTES_BY_PAGE_SUCCESS,
  SET_IS_REQUIRED_UPDATE_TAB,
  SET_IS_NETWORK_CONNECTED,
  SET_NEW_COMMENT_INFO,
} from './actions';

const DEFAULT = {
  isNetworkConnected: true,
};

const viewPersistConfig = {
  key: 'View',
  storage: AsyncStorage,
  blacklist: [
    'coreScreenInfo',
    'driverNotes',
    'isRequiredUpdateTab',
    'isNetworkConnected',
    'newCommentInfo',
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
      case GET_DRIVER_NOTES_SUCCESS:
        draft.driverNotes = payload.data;
        break;
      case GET_DRIVER_NOTES_BY_PAGE_SUCCESS:
        draft.driverNotes.concat(payload.data);
        break;
      case SET_IS_REQUIRED_UPDATE_TAB:
        draft.isRequiredUpdateTab = payload;
        break;
      case SET_IS_NETWORK_CONNECTED:
        draft.isNetworkConnected = payload;
        break;
      case SET_NEW_COMMENT_INFO:
        draft.newCommentInfo = payload;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(viewPersistConfig, View);
