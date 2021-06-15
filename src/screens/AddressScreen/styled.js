import React from 'react';
import styled from 'styled-components';
import Dash from 'react-native-dash';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE8,
  HEIGHT,
  FONT,
} from 'src/constants';
import { SIZE10 } from '../../constants';

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
  border-color: ${props => props.color || COLORS.BLACK2};
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

const MapBackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${SIZE8}px;
  left: ${SIZE4}px;
  width: ${SIZE10}px;
  height: ${SIZE10}px;
  border-radius: ${SIZE10}px;
  align-items: center;
  justify-content: center;
  background: ${COLORS.WHITE1};
  elevation: 8;
  box-shadow: 0px 2px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.4;
  shadow-radius: 4px;
`;

const NavigationView = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${HEIGHT/2}px;
  background: ${COLORS.WHITE1};
  elevation: 2;
  box-shadow: 0px 2px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.4;
  border-radius: ${SIZE2}px;
`;

const DefaultButtonWrap = styled.View`
  margin-horizontal: ${SIZE4}px;
`;

const AddressText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.GRAY3};
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
  LocationWrap,
  IconWrap,
  ButtonWrap,
  LocationIcon,
  Location1Line,
  Location2Line,
  Location3Line,
  MapBackButton,
  NavigationView,
  DefaultButtonWrap,
  AddressText
};
