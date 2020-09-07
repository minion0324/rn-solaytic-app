import { Navigation } from 'react-native-navigation';

import { headlessTask } from 'src/utils';
import  { pushSingleScreenApp } from './src/navigation';

headlessTask();

Navigation.events().registerAppLaunchedListener(() => {
  pushSingleScreenApp();
});
