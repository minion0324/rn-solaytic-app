import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Alert,
  NativeEventEmitter,
  DeviceEventEmitter,
  TouchableOpacity,
  FlatList,
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
  BorderView,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  InfoText,
} from 'src/styles/text.styles';

import {
  ListWrap,
} from './styled';

const {
  BlueActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
} = SVGS;

const BluetoothPrinterScreen = ({
  base64Str,
  componentId,
}) => {
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [connectedDevice, setConnectedDevice] = useState({});

  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDevices, setFoundDevices] = useState([]);

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

  useEffect(() => {
    if (!loading && connecting) {
      setLoading(connecting);
    }
  }, [loading]);

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
      res = typeof (result.devices) === 'object'
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
      res = typeof (result.device) === 'object'
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

  const onPrint = async (item) => {
    let columnWidths = [16, 16];
    let columnArrayWidths = [12, 20];
    switch (item.type) {
      case 'image':
        await BluetoothEscposPrinter.printerInit();
        await BluetoothEscposPrinter.printPic(item.value, { width: 380, left: 0 });
        await BluetoothEscposPrinter.printText("\n\r", {});
        break;

      case 'header':
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
        await BluetoothEscposPrinter.printText(`${item.value}\n\r`, {});
        break;

      case 'text':
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
        await BluetoothEscposPrinter.printText(`${item.value}\n\r`, {});
        break;

      case 'column':
        if (item.value[1] > 15) columnWidths = [15, 17];
        await BluetoothEscposPrinter.printColumn(columnWidths,
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          [item.value[0], item.value[1]], {});
        break;

      case 'column_array':
        let str = item.value[0];
        let space = '';
        if (str.length > 12) {
          const n = str.indexOf(' ');
          for (let i = 0; i < 10 - n; i++) {
            space = space + ' ';
          }
          str = str.slice(0, n + 1) + space + str.slice(n + 1);
        }
        await BluetoothEscposPrinter.printColumn(columnArrayWidths,
          [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
          [str, item.value[1][0]], {});
        if (item.value[1].length > 1) {
          await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
          for (let i = 1; i < item.value[1].length; i++) {
            await BluetoothEscposPrinter.printText(`${item.value[1][i]}\n\r`, {});
          }
        }
        break;

      case 'space':
        await BluetoothEscposPrinter.printText("\n\r", {});
        break;

      case 'dotline':
        await BluetoothEscposPrinter.printText("--------------------------------\n\r", {});
        break;

      default:
        break;
    }
  }

  const onConfirm = async () => {
    try {
      setLoading(true);

      for (let i = 0; i < base64Str.length; i++) {
        await onPrint(base64Str[i]);
      }
      await BluetoothEscposPrinter.printText("\n\r", {});
      await BluetoothEscposPrinter.printText("\n\r", {});

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Warning', error.message || 'Something went wrong.');
    }
  }

  const onPressItem = async (item) => {
    try {
      setLoading(true);
      setConnecting(true);

      await BluetoothManager.connect(item.address);

      setConnectedDevice(item);

      setConnecting(false);
      setLoading(false);
    } catch (error) {
      setConnecting(false);
      setLoading(false);

      Alert.alert('Warning', error.message || 'Something went wrong.');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <SpaceView mTop={SIZE1} />
        <TouchableOpacity
          onPress={() => onPressItem(item)}
        >
          <RowWrap>
            {
              item.address === connectedDevice.address
                ? <BlueActiveCircleCheckIcon />
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
      <BorderView />
      <ContentWrap>
        {
          pairedDevices.length > 0
            ? <ListWrap>
              <FlatList
                data={pairedDevices}
                keyExtractor={item => item.address}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </ListWrap>
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
      <BorderView />
      <ContentWrap>
        {
          foundDevices.length > 0
            ? <ListWrap>
              <FlatList
                data={foundDevices}
                keyExtractor={item => item.address}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </ListWrap>
            : <InfoText color={COLORS.RED1}>No Device</InfoText>
        }
      </ContentWrap>
      <SpaceView mTop={SIZE2} />
      <BorderView />
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
      <SpaceView mTop={SIZE2} />
    </OverlayWrap>
  );
};

BluetoothPrinterScreen.propTypes = {
  base64Str: PropTypes.array.isRequired,
  componentId: PropTypes.string.isRequired,
};

BluetoothPrinterScreen.defaultProps = {
  //
};

export default BluetoothPrinterScreen;
