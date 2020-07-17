import React from 'react';
import {Navigation} from 'react-native-navigation';

import { Provider } from 'src/redux';

import {
  LoginScreen,
  AlertScreen,
  JobsScreen,
  ProfileScreen,
  JobDetailsScreen,
  SignatureScreen,
} from 'src/screens';

import {
  LOGIN_SCREEN,
  ALERT_SCREEN,
  JOBS_SCREEN,
  PROFILE_SCREEN,
  JOB_DETAILS_SCREEN,
  SIGNATURE_SCREEN,
} from './Screens';

function WrappedComponent(Component) {
  return function inject(props) {
    const EnhancedComponent = () => (
      <Provider>
        <Component {...props} />
      </Provider>
    );

    return <EnhancedComponent />;
  };
}

export default function () {
  Navigation.registerComponent(LOGIN_SCREEN, () => WrappedComponent(LoginScreen));
  Navigation.registerComponent(ALERT_SCREEN, () => WrappedComponent(AlertScreen));
  Navigation.registerComponent(JOBS_SCREEN, () => WrappedComponent(JobsScreen));
  Navigation.registerComponent(PROFILE_SCREEN, () => WrappedComponent(ProfileScreen));
  Navigation.registerComponent(JOB_DETAILS_SCREEN, () => WrappedComponent(JobDetailsScreen));
  Navigation.registerComponent(SIGNATURE_SCREEN, () => WrappedComponent(SignatureScreen));
}
