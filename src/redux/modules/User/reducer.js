import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  LOGIN_SUCCESS,
  SET_REMEMBERED_USER,
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
      case LOGIN_SUCCESS:
        draft.token = payload.token;
        draft.userInfo = payload.user;
        break;
      case SET_REMEMBERED_USER:
        draft.rememberedUser = payload;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(userPersistConfig, User);
