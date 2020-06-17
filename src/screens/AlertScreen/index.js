import React from 'react';
import PropTypes from 'prop-types';

import {
  Header,
} from 'src/components';
import {
  SVGS,
} from 'src/constants';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';

import {
  HelloText,
} from './styled';

const { SideMenuIcon } = SVGS;

const AlertScreen = ({ componentId }) => {
  return (
    <Container>
      <ShadowWrap>
        <Header
          leftIcon={<SideMenuIcon />}
          rightIcon={<HelloText>Hello, William Tan</HelloText>}
        />
      </ShadowWrap>
    </Container>
  );
};

AlertScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default AlertScreen;
