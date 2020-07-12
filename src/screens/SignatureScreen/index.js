import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Signature from 'react-native-signature-canvas';

import {
  pushSingleScreenApp,
} from 'src/navigation';
import {
  HeaderBar,
  BottomBar,
} from 'src/components';
import {
  SVGS,
} from 'src/constants';
import {
  //
} from 'src/redux';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
} from 'src/styles/header.styles';

import {
  //
} from './styled';

const { AvatarIcon } = SVGS;

const SignatureScreen = ({
  componentId,
}) => {

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Signature</ScreenText>}
        />
      </ShadowWrap>
      <Signature
        webStyle={{

        }}
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
