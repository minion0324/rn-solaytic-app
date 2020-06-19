import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import produce from 'immer';

const DEFAULT = {
  networkConnection: true,
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
      //
    }
  });
  /* eslint-enable */
}

export default persistReducer(userPersistConfig, User);
