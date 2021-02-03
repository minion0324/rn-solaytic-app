import React from 'react';
import styled from 'styled-components';
import Dash from 'react-native-dash';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE6,
  SIZE8,
  SIZE20,
} from 'src/constants';

const JobTypeWrap = styled.View`
  width: ${SIZE20}px;
  height: ${SIZE6}px;
  align-items: center;
  justify-content: center;
  margin-top: ${SIZE4}px;
  align-self: center;
  border-width: 1px;
  border-color: ${COLORS.GRAY1};
  border-radius: ${SIZE1}px;
`;

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

const LocationIcon = styled.View`
  width: ${SIZE4}px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border-radius: ${SIZE2}px;
  border-width: 2px;
  border-color: ${COLORS.BLACK2};
  background-color: ${COLORS.WHITE1};
`;

const LocationLine = styled(Dash)`
  height: ${props => props.height};
  flex-direction: column;
  top: ${props => props.top};
  left: ${SIZE8 - 1}px;
  position: absolute;
  opacity: 0.2;
`;

const Location1Line = () => (
  <LocationLine
    dashGap={5}
    dashLength={5}
    dashThickness={3}
    dashColor={COLORS.BLUE5}

    height={'100%'}
    top={`${SIZE8 + SIZE1}px`}
  />
);

const Location3Line = () => (
  <LocationLine
    dashGap={5}
    dashLength={5}
    dashThickness={3}
    dashColor={COLORS.BLUE5}

    height={`${SIZE3}px`}
    top={`${SIZE2}px`}
  />
);

const Location2Line = () => (
  <>
    <Location3Line />
    <Location1Line />
  </>
);

export {
  JobTypeWrap,
  LocationWrap,
  IconWrap,
  ButtonWrap,
  LocationIcon,
  Location1Line,
  Location2Line,
  Location3Line,
};
