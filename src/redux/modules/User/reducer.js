import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  PERSIST_REHYDRATED,
  LOGIN_SUCCESS,
  SET_REMEMBERED_USER,
  AUTH_TOKEN_SUCCESS,
  LOGOUT,
} from './actions';

const DEFAULT = {
  //
};

const userPersistConfig = {
  key: 'User',
  storage: AsyncStorage,
  blacklist: [
    //
  ],
};

function User(state = DEFAULT, action = {}) {
  /* eslint-disable */
  return produce(state, draft => {
    const { type, payload } = action;

    switch (type) {
      case PERSIST_REHYDRATED:
        draft.isRehydrated = true;
        break;
      case SET_REMEMBERED_USER:
        draft.rememberedUser = payload;
        break;
      case LOGIN_SUCCESS:
      case AUTH_TOKEN_SUCCESS:
        draft.token = payload.token;
        draft.userInfo = payload.user;
        break;
      case LOGOUT:
        draft.token = '';
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(userPersistConfig, User);
