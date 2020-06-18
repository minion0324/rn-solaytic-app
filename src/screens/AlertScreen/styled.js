import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
  FONT,
} from 'src/constants';

const HelloText = styled.Text`
  font-size: ${FONT(18)}px;
  font-weight: 500;
  color: ${COLORS.WHITE1};
`;

const ButtonWrap = styled.View`
  height: ${COMMON_SIZE * 0.4}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.BLUE1};
  padding-horizontal: ${COMMON_PADDING}px;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  background-color: ${COLORS.WHITE1};
  align-items: center;
  justify-content: center;
  margin-horizontal: ${COMMON_PADDING}px;
  padding-vertical: ${COMMON_PADDING / 2}px;
  border-radius: 3px;
`;

const ButtonText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${props => props.color};
  text-transform: uppercase;
`;

export {
  HelloText,
  ButtonWrap,
  Button,
  ButtonText,
};
