import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  HeaderBar,
} from 'src/components';
import {
  popScreen,
} from 'src/navigation';

import {
  Container,
  Content,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  Back,
} from 'src/styles/header.styles';

const ScanCodeScreen = ({
  componentId,
}) => {

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
