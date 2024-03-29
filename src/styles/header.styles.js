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
  CloseIcon,
  CheckIcon,
  CircleHelpIcon,
} = SVGS;

const ScreenText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${props => props.color || COLORS.BLACK2};
`;

const EmptyWrap = styled.View`
  width: ${SIZE8}px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
`;

//
const Back = () => (
  <EmptyWrap>
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
  <EmptyWrap>
    <ShareIcon />
  </EmptyWrap>
);

const Close = () => (
  <EmptyWrap>
    <CloseIcon />
  </EmptyWrap>
);

const Check = () => (
  <EmptyWrap>
    <CheckIcon />
  </EmptyWrap>
);

const Help = () => (
  <EmptyWrap>
    <CircleHelpIcon />
  </EmptyWrap>
);

export {
  ScreenText,
  EmptyWrap,
  Back,
  SideMenu,
  Calendar,
  Sharing,
  Close,
  Check,
  Help,
};
