import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE8,
  FONT,
} from 'src/constants';

const ButtonWrap = styled.View`
  height: ${SIZE8}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.BLUE1};
  padding-horizontal: ${SIZE2}px;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  background-color: ${COLORS.WHITE1};
  align-items: center;
  justify-content: center;
  margin-horizontal: ${SIZE2}px;
  padding-vertical: ${SIZE1}px;
  border-radius: 3px;
`;

const ButtonText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${props => props.color};
  text-transform: uppercase;
`;

export {
  ButtonWrap,
  Button,
  ButtonText,
};
