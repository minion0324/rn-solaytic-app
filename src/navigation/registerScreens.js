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
  UploadHistoryScreen,
  AddressScreen,
  DriverMessageScreen,
  ScanCodeScreen,
  AddServicesScreen,
  BluetoothPrinterScreen,
  PreviewScreen,
  AddWasteTypesScreen,
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
  UPLOAD_HISTORY_SCREEN,
  ADDRESS_SCREEN,
  DRIVER_MESSAGE_SCREEN,
  SCAN_CODE_SCREEN,
  ADD_SERVICES_SCREEN,
  BLUETOOTH_PRINTER_SCREEN,
  PREVIEW_SCREEN,
  ADD_WASTE_TYPES_SCREEN,
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
  Navigation.registerComponent(UPLOAD_HISTORY_SCREEN, () => WrappedComponent(UploadHistoryScreen));
  Navigation.registerComponent(ADDRESS_SCREEN, () => WrappedComponent(AddressScreen));
  Navigation.registerComponent(DRIVER_MESSAGE_SCREEN, () => WrappedComponent(DriverMessageScreen));
  Navigation.registerComponent(SCAN_CODE_SCREEN, () => WrappedComponent(ScanCodeScreen));
  Navigation.registerComponent(ADD_SERVICES_SCREEN, () => WrappedComponent(AddServicesScreen));
  Navigation.registerComponent(BLUETOOTH_PRINTER_SCREEN, () => WrappedComponent(BluetoothPrinterScreen));
  Navigation.registerComponent(PREVIEW_SCREEN, () => WrappedComponent(PreviewScreen));
  Navigation.registerComponent(ADD_WASTE_TYPES_SCREEN, () => WrappedComponent(AddWasteTypesScreen));
};
