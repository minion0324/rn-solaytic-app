import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';

import {
  HeaderBar,
} from 'src/components';
import {
  popScreen,
} from 'src/navigation';
import {
  SIZE2,
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

const ScanCodeScreen = ({
  componentId,
}) => {

  const cameraRef = useRef(null);

  useEffect(() => {
    console.log('----------------- camera ref');
    console.log(cameraRef.current);
  }, []);

  const onBack = () => {
    popScreen(componentId);
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
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RNCamera
            ref={cameraRef}
            style={{
              backgroundColor: 'red',
              width: 250,
              height: 250,
            }}
            notAuthorizedView={
              <View style={{flex: 1, width: '100%', backgroundColor: 'red'}}>
              </View>
            }
            onBarCodeRead={() => {}}
            refreshAuthorizationStatus={async () => {
              console.log('---------------');
              console.log('---------- refresh auth status');
            }}
            ratio={'1:1'}
          >

          </RNCamera>

        </ContentWrap>
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
