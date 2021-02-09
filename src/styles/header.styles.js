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
  DeactivePrintIcon,
  CloseIcon,
  CheckIcon,
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

const Printing = () => (
  <EmptyWrap>
    <DeactivePrintIcon />
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

export {
  ScreenText,
  EmptyWrap,
  Back,
  SideMenu,
  Calendar,
  Sharing,
  Printing,
  Close,
  Check,
};
