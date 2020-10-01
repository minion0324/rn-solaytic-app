import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, ScrollView } from 'react-native';
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
  Container,
  Content,
  ContentWrap,
  ShadowWrap,
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
} = SVGS;

const ScanCodeScreen = ({
  componentId,
}) => {
  const [ detected, setDetected ] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    console.log('----------------- camera ref');
    console.log(cameraRef.current);


    // cameraRef.current.onStatusChange((status) => {
    //   console.log('-------------- status');
    //   console.log(status);
    // })

  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onCodeDetected = (res) => {
    if (detected) {
      return;
    }

    setDetected(true);
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
              <InfoText>
                adfa adf asdf adf
              </InfoText>
            </InfoWrap>
            <LabelWrap>
              <LabelText>Bin Type</LabelText>
            </LabelWrap>
            <InfoWrap>
              <InfoText>
                adfa adf asdf adf
              </InfoText>
            </InfoWrap>
            <SpaceView mTop={SIZE4} />
            <ButtonWrap>
              <DefaultButton
                onPress={() => {}}
                text={'Confirm'}
                color={COLORS.BLUE1}
                // loading={loading}
              />
            </ButtonWrap>
            <ButtonWrap>
              <DefaultButton
                onPress={() => {}}
                text={'Rescan'}
                color={COLORS.WHITE1}
                textColor={COLORS.BLACK2}
                // loading={loading}
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
  componentId: PropTypes.string.isRequired,
};

ScanCodeScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    //
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScanCodeScreen);
