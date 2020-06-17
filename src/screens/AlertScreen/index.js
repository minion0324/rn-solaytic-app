import React from 'react';
import PropTypes from 'prop-types';

import {
  Header,
  JobCard,
  ListContainer,
  ListItemWrap,
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
      <ListContainer
        data={['job1']}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListItemWrap>
            <JobCard />
          </ListItemWrap>
        )}
      />
    </Container>
  );
};

AlertScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default AlertScreen;
