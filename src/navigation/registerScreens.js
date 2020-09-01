import React from 'react';
import { Navigation } from 'react-native-navigation';
import { NavigationProvider } from 'react-native-navigation-hooks';

import { Provider } from 'src/redux';

import {
  LoginScreen,
  AlertScreen,
  JobsScreen,
  DrawerScreen,
  JobDetailsScreen,
  SignatureScreen,
  FailJobScreen,
  CustomModalScreen,
} from 'src/screens';

import {
  LOGIN_SCREEN,
  ALERT_SCREEN,
  JOBS_SCREEN,
  DRAWER_SCREEN,
  JOB_DETAILS_SCREEN,
  SIGNATURE_SCREEN,
  FAIL_JOB_SCREEN,
  CUSTOM_MODAL_SCREEN,
} from './Screens';

function WrappedComponent(Component) {
  return function inject(props) {
    const EnhancedComponent = () => (
      <Provider>
        <NavigationProvider
          value={{ componentId: props.componentId }}
        >
          <Component {...props} />
        </NavigationProvider>
      </Provider>
    );

    return <EnhancedComponent />;
  };
}

export default function () {
  Navigation.registerComponent(LOGIN_SCREEN, () => WrappedComponent(LoginScreen));
  Navigation.registerComponent(ALERT_SCREEN, () => WrappedComponent(AlertScreen));
  Navigation.registerComponent(JOBS_SCREEN, () => WrappedComponent(JobsScreen));
  Navigation.registerComponent(DRAWER_SCREEN, () => WrappedComponent(DrawerScreen));
  Navigation.registerComponent(JOB_DETAILS_SCREEN, () => WrappedComponent(JobDetailsScreen));
  Navigation.registerComponent(SIGNATURE_SCREEN, () => WrappedComponent(SignatureScreen));
  Navigation.registerComponent(FAIL_JOB_SCREEN, () => WrappedComponent(FailJobScreen));
  Navigation.registerComponent(CUSTOM_MODAL_SCREEN, () => WrappedComponent(CustomModalScreen));
}
