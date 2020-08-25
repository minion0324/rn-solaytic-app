import styled from 'styled-components';

import {
  COLORS,
  HEIGHT,
  SIZE1,
  SIZE2,
  SIZE4,
  SIZE5,
  SIZE8,
  SIZE10,
  FONT,
} from 'src/constants';

const Content = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: ${SIZE8}px;
  padding-vertical: ${SIZE4}px;
`;

const LogoWrap = styled.View`
  width: 75%;
  height: ${HEIGHT * 0.25}px;
  align-items: center;
  justify-content: center;
  margin-vertical: ${SIZE8}px;
`;

const Logo = styled.Image`
  width: 100%;
  height: 100%;
`;

const InputRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-vertical: ${SIZE2}px;
`;

const InputWrap = styled.View`
  flex: 1;
  height: ${SIZE8}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.WHITE3};
  margin-left: ${SIZE2}px;
  padding-horizontal: ${SIZE4}px;
`;

const Input = styled.TextInput`
  width: 80%;
  padding: 0px;
  color: ${COLORS.BLACK2};
  font-size: ${FONT(15)}px;
  font-weight: 500;
`;

const LeftWrap = styled.View`
  width: ${SIZE8}px;
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
  border-radius: ${SIZE1}px;
  background-color: ${COLORS.WHITE3};
`;

const RightWrap = styled.TouchableOpacity`
  width: 20%;
  align-items: flex-end;
`;

const RememberWrap = styled.TouchableOpacity`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  padding-vertical: ${SIZE2}px;
`;

const RememberText = styled.Text`
  font-size: ${FONT(12)}px;
  color: ${COLORS.BLACK2};
  margin-left: ${SIZE2}px;
`;

const ButtonWrap = styled.View`
  width: 100%;
  margin-vertical: ${SIZE4}px;
`;

export {
  Content,
  LogoWrap,
  Logo,
  InputRow,
  InputWrap,
  Input,
  LeftWrap,
  RightWrap,
  RememberWrap,
  RememberText,
  ButtonWrap,
};
