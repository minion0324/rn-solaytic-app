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
  COLORS,
} from 'src/constants';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';

import {
  HelloText,
  ButtonWrap,
  Button,
  ButtonText,
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
        <ButtonWrap>
          <Button>
            <ButtonText color={COLORS.RED1}>REJECT</ButtonText>
          </Button>
          <Button>
            <ButtonText color={COLORS.BLUE1}>ACKNOWLEDGE (2)</ButtonText>
          </Button>
        </ButtonWrap>
      </ShadowWrap>
      <ListContainer
        data={['job1', 'job2', 'job3', 'job4', 'job5',]}
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
