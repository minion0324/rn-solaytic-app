import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Alert, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';

import {
  HeaderBar,
  DefaultButton,
} from 'src/components';
import {
  popScreen,
} from 'src/navigation';
import {
  SVGS,
  COLORS,
  SIZE2,
  SIZE4,
} from 'src/constants';
import {
  ViewStore,
} from 'src/redux';

import {
  Container,
  Content,
  ContentWrap,
  ShadowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  Back,
} from 'src/styles/header.styles';
import {
  LabelText,
  InfoText,
} from 'src/styles/text.styles';

import {
  CameraWrap,
  LabelWrap,
  InfoWrap,
  ButtonWrap,
  InfoInput,
  Mask1IconWrap,
  Mask2IconWrap,
  Mask3IconWrap,
  Mask4IconWrap,
  ScanQr,
  CameraStyle,
} from './styled';

const {
  Mask1Icon,
  Mask2Icon,
  Mask3Icon,
  Mask4Icon,
  KeyboardIcon,
} = SVGS;

const ScanCodeScreen = ({
  binNumbers,
  getBinNumbers,
  binIndex,
  binInfo,
  setBinInfo,
  componentId,
}) => {
  const [ originBinInfo, setOriginBinInfo ] = useState([]);

  const [ loading, setLoading ] = useState(false);
  const [ detected, setDetected ] = useState(false);

  const cameraRef = useRef(null);
  const inputBinWeight = useRef(null);

  const bin = useMemo(() => {
    return originBinInfo[binIndex] || {};
  }, [originBinInfo, binIndex]);

  useEffect(() => {
    setOriginBinInfo(binInfo);
  }, []);

  const onUpdateBinInfo = (newInfo) => {
    const newBinInfo = originBinInfo.slice(0);

    newBinInfo[binIndex] = {
      ...newBinInfo[binIndex],
      ...newInfo,
    };

    setOriginBinInfo(newBinInfo);
  };

  const onBack = () => {
    Keyboard.dismiss();
    popScreen(componentId);
  };

  const getBinNumbersSuccess = () => {
    setLoading(false);
    onUpdateBinInfo({
      binType: binNumbers[0].binType,
      binNumber: binNumbers[0].binNumberName,
    });
  };

  const getBinNumbersFailure = () => {
    setLoading(false);
  };

  const onCodeDetected = (res) => {
    if (detected) {
      return;
    }

    setLoading(true);
    setDetected(true);

    Keyboard.dismiss();

    getBinNumbers({
      search: res.data,
      success: getBinNumbersSuccess,
      failure: getBinNumbersFailure,
    });
  };

  const onCameraStatusChange = (status) => {
    if (status.cameraStatus === 'NOT_AUTHORIZED') {
      Alert.alert(
        'Warning',
        'Camera not authorized',
        [
          {
            text: 'OK',
            onPress: onBack,
          },
        ],
        { cancelable: false },
      );
    }
  };

  const onConfirm = () => {
    setBinInfo(originBinInfo);
    onBack();
  };

  const onRescan = () => {
    setDetected(false);
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Scan QR Code</ScreenText>}
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <Content>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <SpaceView mTop={SIZE2} />
          <ContentWrap>
            <CameraWrap>
              {
                detected
                ? <ScanQr />
                : <RNCamera
                    ref={cameraRef}
                    style={CameraStyle}
                    notAuthorizedView={<View />}
                    ratio={'1:1'}
                    onBarCodeRead={onCodeDetected}
                    onStatusChange={onCameraStatusChange}
                  />
              }

              <Mask1IconWrap>
                <Mask1Icon />
              </Mask1IconWrap>
              <Mask2IconWrap>
                <Mask2Icon />
              </Mask2IconWrap>
              <Mask3IconWrap>
                <Mask3Icon />
              </Mask3IconWrap>
              <Mask4IconWrap>
                <Mask4Icon />
              </Mask4IconWrap>
            </CameraWrap>
          </ContentWrap>

          <SpaceView mTop={SIZE2} />
          <ContentWrap>
            <LabelWrap>
              <LabelText>Bin ID</LabelText>
            </LabelWrap>
            <InfoWrap color={COLORS.WHITE3}>
              <FlexWrap flex={1} />
              <FlexWrap flex={5}>
                <InfoInput
                  ref={inputBinWeight}
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  placeholder={'BIN NUMBER'}
                  value={`${bin['binNumber'] || ''}`}
                  onChangeText={(text) => onUpdateBinInfo({ binNumber: text })}
                />
              </FlexWrap>
              <FlexWrap flex={1}>
                <TouchableOpacity
                  onPress={() => inputBinWeight.current.focus()}
                >
                  <KeyboardIcon />
                </TouchableOpacity>
              </FlexWrap>
            </InfoWrap>
            <LabelWrap>
              <LabelText>Bin Type</LabelText>
            </LabelWrap>
            <InfoWrap>
              <InfoText>
                {bin['binType'] && bin['binType']['binTypeName']}
              </InfoText>
            </InfoWrap>
            <SpaceView mTop={SIZE4} />
            <ButtonWrap>
              <DefaultButton
                onPress={onConfirm}
                text={'Confirm'}
                color={COLORS.BLUE1}
                loading={loading}
              />
            </ButtonWrap>
            <ButtonWrap>
              <DefaultButton
                onPress={
                  (loading || !detected) ? null : onRescan
                }
                text={'Rescan'}
                color={COLORS.WHITE1}
                textColor={COLORS.BLACK2}
              />
            </ButtonWrap>
          </ContentWrap>
          <SpaceView mTop={SIZE2} />
        </ScrollView>
      </Content>
    </Container>
  );
};

ScanCodeScreen.propTypes = {
  binNumbers: PropTypes.array.isRequired,
  getBinNumbers: PropTypes.func.isRequired,
  binIndex: PropTypes.number.isRequired,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

ScanCodeScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    binNumbers:  ViewStore.selectors.getBinNumbers(state),
  };
};

const mapDispatchToProps = {
  getBinNumbers: ViewStore.actionCreators.getBinNumbers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScanCodeScreen);
