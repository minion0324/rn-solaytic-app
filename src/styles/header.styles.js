import React from 'react';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE8,
  SIZE12,
  FONT,
} from 'src/constants';

const {
  BackIcon,
  FailIcon,
  SideMenuIcon,
  CalendarIcon,
} = SVGS;

const ScreenText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
`;

const EmptyWrap = styled.View`
  width: ${SIZE8}px;
  align-items: ${props => props.align || 'flex-start'};
`;

//
const FailJobWrap = styled.View`
  width: ${SIZE12}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FailJobText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
  margin-left: ${SIZE1}px;
`;

const FailJob = () => (
  <FailJobWrap>
    <FailIcon />
    <FailJobText>Fail</FailJobText>
  </FailJobWrap>
);

//
const Back = () => (
  <EmptyWrap align={'center'}>
    <BackIcon />
  </EmptyWrap>
);

const SideMenu = () => (
  <EmptyWrap>
    <SideMenuIcon />
  </EmptyWrap>
);

//
const Calendar = () => (
  <EmptyWrap>
    <CalendarIcon />
  </EmptyWrap>
);

export {
  ScreenText,
  EmptyWrap,
  FailJob,
  Back,
  SideMenu,
  Calendar,
};
