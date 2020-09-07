import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE8,
  SIZE10,
  SIZE12,
  FONT,
} from 'src/constants';
import { changeTabIndex } from 'src/navigation';

const {
  AlertIcon,
  ActiveAlertIcon,
  JobsIcon,
  ActiveJobsIcon,
} = SVGS;

const Container = styled.View`
  width: 100%;
  height: ${SIZE10}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: ${COLORS.WHITE1};
`;

const Tab = styled.TouchableOpacity`
  width: ${SIZE12}px;
  height: ${SIZE8}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  font-size: ${FONT(13)}px;
  font-weight: 500;
  color: ${(props) => (
    props.active ? COLORS.BLUE1 : COLORS.GRAY3
  )};
  margin-left: ${SIZE1}px;
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
    </Container>
  );
};

BottomBar.propTypes = {
  componentId: PropTypes.string.isRequired,
  activeIndex: PropTypes.number.isRequired,
};

export default BottomBar;
