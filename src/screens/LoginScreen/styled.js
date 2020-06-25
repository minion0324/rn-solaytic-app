import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE4,
  SIZE5,
  SIZE8,
  SIZE10,
  SIZE12,
  FONT,
} from 'src/constants';

const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${SIZE8}px;
`;

const Logo = styled.Image`
  margin-bottom: ${SIZE12}px;
`;

const InputWrap = styled.View`
  width: 100%;
  height: ${SIZE10}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.BLUE2};
  border-radius: ${SIZE5}px;
  margin-vertical: ${SIZE2}px;
  padding-horizontal: ${SIZE5}px;
`;

const Input = styled.TextInput`
  width: 70%;
  padding: 0px;
  color: ${COLORS.BLACK2};
  font-size: ${FONT(15)}px;
  font-weight: 500;
  text-align: center;
`;

const LeftWrap = styled.View`
  width: 15%;
  align-items: flex-start;
`;

const RightWrap = styled.TouchableOpacity`
  width: 15%;
  align-items: flex-end;
`;

const RememberWrap = styled.TouchableOpacity`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  margin-left: ${SIZE5}px;
  padding-vertical: ${SIZE2}px;
`;

const RememberText = styled.Text`
  font-size: ${FONT(12)}px;
  color: ${COLORS.BLUE1};
  margin-left: ${SIZE2}px;
`;

const ButtonWrap = styled.View`
  width: 100%;
  margin-vertical: ${SIZE4}px;
`;

const LoginButton = styled.TouchableOpacity`
  height: ${SIZE10}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.BLUE1};
  border-radius: ${SIZE5}px;
`;

const LoginText = styled.Text`
  font-size: ${FONT(18)}px;
  font-weight: 500;
  color: ${COLORS.WHITE1};
`;

export {
  Content,
  Logo,
  InputWrap,
  Input,
  LeftWrap,
  RightWrap,
  RememberWrap,
  RememberText,
  ButtonWrap,
  LoginButton,
  LoginText,
};
