import React from 'react';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  SIZE12,
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

const EmptyWrap = styled.View`
  width: ${SIZE12}px;
`;

//
const BackButtonWrap = styled.View`
  width: ${SIZE12}px;
  flex-direction: row;
  align-items: center;
  padding-left: ${SIZE2}px;
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
  EmptyWrap,
  BackButton,
};
