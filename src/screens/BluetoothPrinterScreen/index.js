import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Alert,
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
  dismissLightBox,
} from 'src/navigation';
import {
  DefaultButton,
  OverlayWrap,
} from 'src/components';
import {
  SVGS,
  PLATFORM,
  COLORS,
  SIZE1,
  SIZE2,
} from 'src/constants';

import {
  ContentWrap,
  WrapBorder,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  InfoText,
} from 'src/styles/text.styles';

const {
  ActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
} = SVGS;

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
    if (loading) {
      return;
    }

    dismissLightBox(componentId);
  };

  const initializeBluetooth = async () => {
    try {
      const isEnabled = await BluetoothManager.isBluetoothEnabled();
      if (!isEnabled || isEnabled === 'false') {
        const result = await BluetoothManager.enableBluetooth();

        let res = [];
        if (result && result.length > 0) {
          result.forEach((item) => {
            try {
              res.push(JSON.parse(item));
            } catch (error) {
              //
            }
          });

          setPairedDevices(res);

          Toast.show('Bluetooth Enabled.');
        }
      }
    } catch (error) {
      //
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
      setLoading(false);
      Alert.alert('Warning', error.message || 'Something went wrong.');
    }
  };

  const onConfirm = async () => {
    try {
      setLoading(true);

      await BluetoothEscposPrinter.printPic(base64Str, { width: 380, left: 2 });

      setLoading(false);
    } catch (error) {
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
      setLoading(false);
      Alert.alert('Warning', error.message || 'Something went wrong.');
    }
  };

  const renderItem = (item) => {
    return (
      <View key={item.address}>
        <SpaceView mTop={SIZE1} />
        <TouchableOpacity
          key={item.address}
          onPress={() => onPressItem(item)}
          disabled={loading}
        >
          <RowWrap>
            {
              item.address === connectedDevice.address
              ? <ActiveCircleCheckIcon />
              : <DeactiveCircleCheckIcon />
            }
            <SpaceView mLeft={SIZE2} />
            <InfoText numberOfLines={1}>
              {item.name || 'Unknown'}
            </InfoText>
          </RowWrap>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <OverlayWrap
      color={COLORS.WHITE1}
      dismissOverlay={onBack}
    >
      <SpaceView mTop={SIZE2} />
      <ContentWrap>
        <RowWrap>
          <FlexWrap>
            <InfoText color={COLORS.GRAY3}>
              Paired devices
            </InfoText>
          </FlexWrap>
          <TouchableOpacity
            onPress={onScan}
            disabled={loading}
          >
            <InfoText color={COLORS.BLUE1}>
              SCAN
            </InfoText>
          </TouchableOpacity>
        </RowWrap>
      </ContentWrap>
      <WrapBorder />
      <ContentWrap>
        {
          pairedDevices.length > 0
          ? pairedDevices.map(renderItem)
          : <InfoText color={COLORS.RED1}>No Device</InfoText>
        }
      </ContentWrap>
      <SpaceView mTop={SIZE2} />
      <ContentWrap>
        <RowWrap>
          <InfoText color={COLORS.GRAY3}>
            Available devices
          </InfoText>
        </RowWrap>
      </ContentWrap>
      <WrapBorder />
      <ContentWrap>
        {
          foundDevices.length > 0
          ? foundDevices.map(renderItem)
          : <InfoText color={COLORS.RED1}>No Device</InfoText>
        }
      </ContentWrap>
      <SpaceView mTop={SIZE2} />
      <WrapBorder />
      <ContentWrap>
        <DefaultButton
          color={
            connectedDevice.address
            ? COLORS.BLUE1 : COLORS.GRAY3
          }
          text={'Confirm'}
          onPress={
            connectedDevice.address
            ? onConfirm : null
          }
          loading={loading}
        />
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
