import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE3,
  SIZE8,
  SIZE14,
  FONT,
} from 'src/constants';
import { changeTabIndex } from 'src/navigation';

const {
  AlertIcon,
  ActiveAlertIcon,
  JobsIcon,
  ActiveJobsIcon,
  ProfileIcon,
  ActiveProfileIcon,
} = SVGS;

const Container = styled.View`
  width: 100%;
  height: ${SIZE14}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.BLUE1};
  border-top-left-radius: ${SIZE3}px;
  border-top-right-radius: ${SIZE3}px;
  padding-horizontal: ${SIZE8}px;
`;

const Tab = styled.TouchableOpacity`
  width: ${SIZE8}px;
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  margin-top: 3px;
  font-size: ${FONT(13)}px;
  font-weight: 500;
  color: ${(props) => (
    props.active ? COLORS.WHITE1 : COLORS.BLUE3
  )};
`;

const BottomBar = ({
  componentId,
  activeIndex,
}) => {
  return (
    <Container>
      <Tab onPress={() => changeTabIndex(componentId, 0)}>
        {
          activeIndex === 0
          ? <ActiveAlertIcon />
          : <AlertIcon />
        }
        <Text active={activeIndex === 0}>Alert</Text>
      </Tab>
      <Tab onPress={() => changeTabIndex(componentId, 1)}>
        {
          activeIndex === 1
          ? <ActiveJobsIcon />
          : <JobsIcon />
        }
        <Text active={activeIndex === 1}>Jobs</Text>
      </Tab>
      <Tab onPress={() => changeTabIndex(componentId, 2)}>
        {
          activeIndex === 2
          ? <ActiveProfileIcon />
          : <ProfileIcon />
        }
        <Text active={activeIndex === 2}>Profile</Text>
      </Tab>
    </Container>
  );
};

BottomBar.propTypes = {
  componentId: PropTypes.string.isRequired,
  activeIndex: PropTypes.number.isRequired,
};

export default BottomBar;
