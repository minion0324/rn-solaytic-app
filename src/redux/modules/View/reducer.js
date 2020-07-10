import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {
  SET_CURRENT_SCREEN_INFO,
} from './actions';

const DEFAULT = {
  //
};

const viewPersistConfig = {
  key: 'View',
  storage: AsyncStorage,
  blacklist: [
    'currentScreenInfo',
  ],
};

function View(state = DEFAULT, action = {}) {
  /* eslint-disable */
  return produce(state, draft => {
    const { type, payload } = action;

    switch (type) {
      case SET_CURRENT_SCREEN_INFO:
        draft.currentScreenInfo = payload;
        break;
    }
  });
  /* eslint-enable */
}

export default persistReducer(viewPersistConfig, View);
