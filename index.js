import { Navigation } from 'react-native-navigation';
import Bugsnag from '@bugsnag/react-native';

import { headlessTask } from 'src/utils';
import  { pushSingleScreenApp } from './src/navigation';

Bugsnag.start();

headlessTask();

Navigation.events().registerAppLaunchedListener(() => {
  pushSingleScreenApp();
});
