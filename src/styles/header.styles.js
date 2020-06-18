import React from 'react';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  COMMON_PADDING,
  FONT,
} from 'src/constants';

const { ArrowBackIcon } = SVGS;

const HelloText = styled.Text`
  font-size: ${FONT(18)}px;
  font-weight: 500;
  color: ${COLORS.WHITE1};
`;

const ScreenText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.WHITE1};
  text-transform: uppercase;
`;

const JobText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.WHITE1};
`;

//
const BackButtonWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: ${COMMON_PADDING}px;
`;

const BackButtonText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.WHITE1};
  text-transform: uppercase;
  margin-left: ${COMMON_PADDING / 2}px;
`;

const BackButton = () => (
  <BackButtonWrap>
    <ArrowBackIcon />
    <BackButtonText>Back</BackButtonText>
  </BackButtonWrap>
)

export {
  HelloText,
  ScreenText,
  JobText,
  BackButton,
};
