import React from 'react';
import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE8,
} from 'src/constants';

const LocationWrap = styled.View`
  flex-direction: row;
`;

const IconWrap = styled.View`
  width: ${SIZE8}px;
  align-items: center;
`;

const ButtonWrap = styled.View`
  align-items: ${(props) => (
    props.forCenter ? 'center' : 'flex-start'
  )};
  margin-right: ${SIZE4}px;
  margin-vertical: ${SIZE3}px;
`;

const Location1Line = styled.View`
  height: 100%;
  top: ${(props) => (
    props.for2 ? SIZE8 : SIZE8 - SIZE1
  )}px;
  left: ${SIZE8 - 1}px;
  position: absolute;
  border-width: 0.5px;
  border-color: ${COLORS.GRAY3};
`;

const Location3Line = styled.View`
  height: ${SIZE3}px;
  top: ${SIZE2}px;
  left: ${SIZE8 - 1}px;
  position: absolute;
  border-width: 0.5px;
  border-color: ${COLORS.GRAY3};
`;

const Location2Line = () => (
  <>
    <Location3Line />
    <Location1Line for2 />
  </>
);

export {
  LocationWrap,
  IconWrap,
  ButtonWrap,
  Location1Line,
  Location2Line,
  Location3Line,
};
