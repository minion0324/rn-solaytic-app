import {Navigation} from 'react-native-navigation';

import {
  LoginScreen,
  AlertScreen,
  JobsScreen,
  ProfileScreen,
  JobDetailsScreen,
} from 'src/screens';

import {
  LOGIN_SCREEN,
  ALERT_SCREEN,
  JOBS_SCREEN,
  PROFILE_SCREEN,
  JOB_DETAILS_SCREEN,
} from './Screens';

export default function () {
  Navigation.registerComponent(LOGIN_SCREEN, () => LoginScreen);
  Navigation.registerComponent(ALERT_SCREEN, () => AlertScreen);
  Navigation.registerComponent(JOBS_SCREEN, () => JobsScreen);
  Navigation.registerComponent(PROFILE_SCREEN, () => ProfileScreen);
  Navigation.registerComponent(JOB_DETAILS_SCREEN, () => JobDetailsScreen);
}
