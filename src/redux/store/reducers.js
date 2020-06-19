import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import { reducers } from '../modules';

const config = {
  key: 'LIFTED_REDUX_STORE',
  storage: AsyncStorage,
  blacklist: Object.keys(reducers),
};

const appReducer = persistCombineReducers(config, {
  ...reducers,
});

export default function rootReducer(state, action) {
  return appReducer(state, action);
}