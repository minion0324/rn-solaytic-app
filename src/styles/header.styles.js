import React from 'react';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  FONT,
} from 'src/constants';

const { ArrowBackIcon } = SVGS;

const HelloText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  margin-horizontal: ${SIZE4}px;
`;

const ScreenText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
`;

//
const BackButtonWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: ${SIZE2}px;
`;

const BackButtonText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  margin-left: ${SIZE1}px;
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
  BackButton,
};
