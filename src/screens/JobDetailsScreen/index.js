import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Navigation } from 'react-native-navigation';

import {
  Header,
} from 'src/components';
import {
  hideBottomTabs,
  popScreen,
} from 'src/navigation';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  JobText,
  BackButton,
} from 'src/styles/header.styles';

import {
  //
} from './styled';


const JobDetailsScreen = ({ componentId }) => {

  useEffect(() => {
    hideBottomTabs(componentId);
  }, []);

  const toBack = () => {
    popScreen(componentId);
  }

  return (
    <Container>
      <ShadowWrap>
        <Header
          leftIcon={<BackButton />}
          onPressLeft={toBack}
          rightIcon={<JobText>#D918291979</JobText>}
        />
      </ShadowWrap>
    </Container>
  );
};

JobDetailsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default JobDetailsScreen;
