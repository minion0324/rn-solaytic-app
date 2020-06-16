import { Navigation } from 'react-native-navigation';

import  { pushSingleScreenApp } from './src/navigation';

Navigation.events().registerAppLaunchedListener(() => {
  pushSingleScreenApp();
});
