import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Signature from 'react-native-signature-canvas';

import {
  changeOrientation,
  popScreen,
} from 'src/navigation';
import {
  HeaderBar,
} from 'src/components';
import {
  //
} from 'src/redux';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
} from 'src/styles/header.styles';

import {
  //
} from './styled';

const SignatureScreen = ({
  componentId,
}) => {
  useEffect(() => {
    changeOrientation(componentId);
  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onSign = (image) => {
    console.log(image);
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Signature</ScreenText>}
          leftIcon={<BackButton />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>
      <Signature
        onOK={onSign}
      />
    </Container>
  );
};

SignatureScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
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
)(SignatureScreen);
