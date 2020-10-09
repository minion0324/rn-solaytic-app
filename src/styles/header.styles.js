import React from 'react';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE8,
  FONT,
} from 'src/constants';

const {
  BackIcon,
  SideMenuIcon,
  CalendarIcon,
  ShareIcon,
  PrintIcon,
} = SVGS;

const ScreenText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${props => props.color || COLORS.BLACK2};
`;

const EmptyWrap = styled.View`
  width: ${SIZE8}px;
  align-items: ${props => props.align || 'flex-start'};
`;

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

const Calendar = () => (
  <EmptyWrap>
    <CalendarIcon />
  </EmptyWrap>
);

const Sharing = () => (
  <EmptyWrap align={'center'}>
    <ShareIcon />
  </EmptyWrap>
);

const Printing = () => (
  <EmptyWrap align={'center'}>
    <PrintIcon />
  </EmptyWrap>
);

export {
  ScreenText,
  EmptyWrap,
  Back,
  SideMenu,
  Calendar,
  Sharing,
  Printing,
};
