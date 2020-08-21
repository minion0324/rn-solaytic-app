import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE4,
  SIZE8,
  SIZE22,
  FONT,
} from 'src/constants';

const ModalWrap = styled.View`
  padding: ${SIZE4}px;
  background-color: ${props => props.color || COLORS.WHITE1};
`;

const ModalTopText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
  margin-bottom: ${SIZE2}px;
`;

const ModalInput = styled.TextInput`
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 600,
  color: ${COLORS.BLACK2};
  margin-vertical: ${SIZE4}px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.BLUE1};
`;

const AlertText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
  text-align: center;
  margin-vertical: ${SIZE4}px;
`;

const AlertButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${SIZE4}px;
`;

const AlertButton = styled.TouchableOpacity`
  width: ${SIZE22}px;
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
  border-radius: ${SIZE2}px;
  border-width: 1px;
  border-color: ${props => props.color || COLORS.BLACK2};
`;

const AlertButtonText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${props => props.color || COLORS.BLACK2};
  text-transform: uppercase;
`;

export {
  ModalWrap,
  ModalTopText,
  ModalInput,
  AlertText,
  AlertButtonRow,
  AlertButton,
  AlertButtonText,
};
