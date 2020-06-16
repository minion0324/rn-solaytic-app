import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
} from 'src/constants';

const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: ${COMMON_SIZE * 2}px;
  aspect-ratio: 1;
  margin-top: -${COMMON_SIZE * 0.8}px;
  border-radius: ${COMMON_SIZE}px;
  background-color: ${COLORS.WHITE1};
`;

const LogoImage = styled.Image`

`;

const LoginForm = styled.View`
  padding-vertical: ${COMMON_PADDING / 2}px;
  padding-horizontal: ${COMMON_PADDING * 3}px;
`;

const InputRow = styled.View`
  width: 100%;
  flex-direction: row;
  padding-vertical: ${COMMON_PADDING / 2}px;
`;

const IconWrap = styled.View`
  height: ${COMMON_SIZE / 2}px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE1};
  border-radius: 3px;
`;

const InputWrap = styled.View`
  flex: 1;
  height: ${COMMON_SIZE / 2}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE1};
  border-radius: 3px;
  margin-left: ${COMMON_PADDING / 2}px;
`;

const Input = styled.TextInput`
  width: 80%;
  padding: 0px;
  color: ${COLORS.BLACK2};
  font-size: 15px;
`;

const CheckRow = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding-vertical: 5px;
  margin-left: ${COMMON_PADDING * 2.5}px;
  padding-vertical: ${COMMON_PADDING}px;
`;

const RememberText = styled.Text`
  font-size: 14px;
  color: ${COLORS.BLACK2};
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  margin-left: ${COMMON_PADDING}px;
`;

const ButtonRow = styled.View`
  margin-vertical: ${COMMON_PADDING * 2}px;
`;

const LoginButton = styled.TouchableOpacity`
  height: ${COMMON_SIZE / 2}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.BLUE1};
`;

const LoginText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${COLORS.WHITE1};
`;

export {
  LogoContainer,
  LogoImage,
  LoginForm,
  InputRow,
  IconWrap,
  InputWrap,
  Input,
  CheckRow,
  RememberText,
  ButtonRow,
  LoginButton,
  LoginText,
};
