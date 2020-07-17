import React from 'react';
import PropTypes from 'prop-types';

import {
  popScreen,
} from 'src/navigation';
import {
  HeaderBar,
} from 'src/components';

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

const FailJobScreen = ({
  componentId,
}) => {
  const onBack = () => {
    popScreen(componentId);
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Fail Job</ScreenText>}
          leftIcon={<BackButton />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

    </Container>
  );
};

FailJobScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default FailJobScreen;
