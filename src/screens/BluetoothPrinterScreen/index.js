import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  ActivityIndicator,
  NativeEventEmitter,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from 'react-native-bluetooth-escpos-printer';
import Toast from 'react-native-simple-toast';

import {
  dismissOverlay,
} from 'src/navigation';
import {
  HeaderBar,
  OverlayWrap,
} from 'src/components';
import {
  PLATFORM,
  COLORS,
  SIZE2,
} from 'src/constants';

import {
  ContentWrap,
  ShadowWrap,
  RowWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
} from 'src/styles/header.styles';
import {
  LabelText,
} from 'src/styles/text.styles';
import {
  OkCancelRow,
  OkCancelButton,
  OkCancelText,
} from 'src/styles/modal.styles';

const BluetoothPrinterScreen = ({
  base64Str,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);

  const [ connectedDevice, setConnectedDevice ] = useState({});

  const [ pairedDevices, setPairedDevices ] = useState([]);
  const [ foundDevices, setFoundDevices ] = useState([]);

  const bluetoothListener1 = useRef(null);
  const bluetoothListener2 = useRef(null);
  const bluetoothListener3 = useRef(null);
  const bluetoothListener4 = useRef(null);

  useEffect(() => {
    initializeBluetooth();
    addBluetoothListeners();

    return () => {
      destroyBluetooth();
    };
  }, []);

  const onBack = () => {
    dismissOverlay(componentId);
  };

  const initializeBluetooth = async () => {
    try {
      const isEnabled = await BluetoothManager.isBluetoothEnabled();
      if (!isEnabled) {
        const result = await BluetoothManager.enableBluetooth();

        let res = [];
        if (result.length > 0) {
          result.forEach((item) => {
            try {
              res.push(JSON.parse(item));
            } catch (error) {
              //
            }
          });
        }

        setPairedDevices(res);

        Toast.show('Bluetooth Enabled.');
      }
    } catch (error) {
      //
      console.log('----- init bluetooth');
      console.log(error);
    }
  };

  const destroyBluetooth = async () => {
    try {
      await BluetoothManager.disableBluetooth();

      bluetoothListener1.current && bluetoothListener1.current.remove();
      bluetoothListener2.current && bluetoothListener2.current.remove();
      bluetoothListener3.current && bluetoothListener3.current.remove();
      bluetoothListener4.current && bluetoothListener4.current.remove();
    } catch (error) {
      //
      console.log('----- destory bluetooth');
      console.log(error);
    }
  };

  const deviceAlreadyPaired = (result) => {
    let res = [];
    try {
      res = typeof(result.devices) === 'object'
        ? result.devices : JSON.parse(result.devices);
    } catch (err) {
      //
    }

    if (res.length > 0) {
      let newPairedDevices = pairedDevices.slice(0);
      newPairedDevices = newPairedDevices.concat(res);
      setPairedDevices(newPairedDevices)
    }
  };

  const deviceFound = (result) => {
    let res = null;
    try {
      res = typeof(result.device) === 'object'
        ? result.device : JSON.parse(result.device);
    } catch (err) {
      //
    }

    if (res) {
      setFoundDevices(prev => {
        const index = prev.findIndex(item => item.address === res.address);
        if (index === -1) {
          return prev.concat(res);
        }
        return prev;
      });
    }
  };

  const connectionLost = () => {
    setConnectedDevice({});
  };

  const addBluetoothListeners = () => {
    if (PLATFORM === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothListener1.current = bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        deviceAlreadyPaired,
      );
      bluetoothListener2.current = bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        deviceFound,
      );
      bluetoothListener3.current = bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        connectionLost,
      );
    } else {
      bluetoothListener1.current = DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        deviceAlreadyPaired,
      );

      bluetoothListener2.current = DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        deviceFound,
      );

      bluetoothListener3.current = DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        connectionLost,
      );

      bluetoothListener4.current = DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
        () => { Toast.show('Not Support Bluetooth.'); },
      );
    }
  };

  const onScan = async () => {
    try {
      setLoading(true);

      await initializeBluetooth();

      const result = await BluetoothManager.scanDevices();

      console.log('-------------- after scan devices');
      console.log(result);

      let res = result.found || [];
      try {
        res = JSON.parse(res);
      } catch (err) {
        //
      }

      if (res.length > 0) {
        setFoundDevices(res);
      }

      setLoading(false);
    } catch (error) {
      console.log('----- on scan');
      console.log(error);

      setLoading(false);
      Alert.alert('Warning', error.message || 'Something went wrong.');
    }
  };

  const onConfirm = async () => {
    try {
      setLoading(true);

      console.log(base64Str);

      await BluetoothEscposPrinter.printPic(base64Str, { width: 360, left: 10 });

      setLoading(false);
    } catch (error) {
      console.log('----- on confirm');
      console.log(error);

      setLoading(false);
      Alert.alert('Warning', error.message || 'Something went wrong.');
    }
  }

  const onPressItem = async (item) => {
    try {
      setLoading(true);

      await BluetoothManager.connect(item.address);

      setConnectedDevice(item);

      setLoading(false);
    } catch (error) {
      console.log('----- on press item');
      console.log(error);

      setLoading(false);
      Alert.alert('Warning', error.message || 'Something went wrong.');
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        key={item.address}
        onPress={() => onPressItem(item)}
      >
        <LabelText numberOfLines={1}>
          {
            `Name: ${item.name || 'UNKNOWN'}` +
            `  Address: ${item.address}`
          }
        </LabelText>
      </TouchableOpacity>
    );
  };

  return (
    <OverlayWrap dismissOverlay={onBack}>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <ScreenText>
              Select Bluetooth Printer
            </ScreenText>
          }
        />
      </ShadowWrap>

      <SpaceView mTop={SIZE2} />
      <ContentWrap>
        <RowWrap>
          <LabelText>Connected Device</LabelText>
          <SpaceView mLeft={SIZE2} />
          {
            loading &&
            <ActivityIndicator />
          }
        </RowWrap>
        {
          connectedDevice.address
          ? <LabelText numberOfLines={1}>
            {
              `Name: ${connectedDevice.name || 'UNKNOWN'}` +
              `  Address: ${connectedDevice.address}`
            }
            </LabelText>
          : <LabelText color={COLORS.RED1}>No Device</LabelText>
        }
      </ContentWrap>

      <SpaceView mTop={SIZE2} />
      <ContentWrap>
        <LabelText>Found Devices (Tap to Connect)</LabelText>

        {
          foundDevices.length > 0
          ? foundDevices.map(renderItem)
          : <LabelText color={COLORS.RED1}>No Device</LabelText>
        }
      </ContentWrap>

      <SpaceView mTop={SIZE2} />
      <ContentWrap>
        <LabelText>Paired Devices</LabelText>
        {
          pairedDevices.length > 0
          ? pairedDevices.map(renderItem)
          : <LabelText color={COLORS.RED1}>No Device</LabelText>
        }
      </ContentWrap>

      <SpaceView mTop={SIZE2} />
      <ContentWrap>
        <OkCancelRow>
          <OkCancelButton
            onPress={onScan}
            disabled={loading}
          >
            <OkCancelText>Scan Device</OkCancelText>
          </OkCancelButton>
          <OkCancelButton
            onPress={onConfirm}
            disabled={loading || !connectedDevice.address}
          >
            <OkCancelText>Confirm</OkCancelText>
          </OkCancelButton>
        </OkCancelRow>
      </ContentWrap>
    </OverlayWrap>
  );
};

BluetoothPrinterScreen.propTypes = {
  base64Str: PropTypes.string.isRequired,
  componentId: PropTypes.string.isRequired,
};

BluetoothPrinterScreen.defaultProps = {
  //
};

export default BluetoothPrinterScreen;
