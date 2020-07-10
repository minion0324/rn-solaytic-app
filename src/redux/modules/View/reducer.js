import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

import {

} from './actions';

const DEFAULT = {
  //
};

const viewPersistConfig = {
  key: 'View',
  storage: AsyncStorage,
  blacklist: [
    //
  ],
};

function View(state = DEFAULT, action = {}) {
  /* eslint-disable */
  return produce(state, draft => {
    const { type, payload } = action;

    switch (type) {

    }
  });
  /* eslint-enable */
}

export default persistReducer(viewPersistConfig, View);
