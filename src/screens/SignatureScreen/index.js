import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Signature from 'react-native-signature-canvas';
import RNFS from 'react-native-fs';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';

import {
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
  setSign,
  componentId,
}) => {
  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onSign = async (base64) => {
    try {
      const path = RNFS.DocumentDirectoryPath + `/sign${moment().format('x')}.jpg`;
      await RNFS.writeFile(path, base64.replace('data:image/png;base64,', ''), 'base64')

      setSign(path);
      onBack();
    } catch (error) {
      //
    }
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
  setSign: PropTypes.func.isRequired,
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
