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

const { SideMenuIcon, SearchIcon } = SVGS;

const JobsScreen = ({ componentId }) => {
  return (
    <Container>
      <ShadowWrap>
        <Header
          leftIcon={<SideMenuIcon />}
          rightIcon={<SearchIcon />}
        />
      </ShadowWrap>
    </Container>
  );
};

JobsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default JobsScreen;
