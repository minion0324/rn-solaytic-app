import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  HeaderBar,
} from 'src/components';

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

const AddServicesScreen = ({
  componentId,
}) => {


  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>History</ScreenText>}
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

AddServicesScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

AddServicesScreen.defaultProps = {
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
)(AddServicesScreen);