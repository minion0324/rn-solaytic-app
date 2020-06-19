import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  SIZE5,
  SIZE6,
  SIZE10,
  SIZE16,
  SIZE20,
  SIZE40,
  FONT,
} from 'src/constants';

const Header = styled.View`
  width: 100%;
  height: ${SIZE20}px;
  background-color: ${COLORS.BLUE1};
`;

const Content = styled.View`
  align-items: center;
  justify-content: center;
  elevation: 12;
`;

const LogoWrap = styled.View`
  align-items: center;
  justify-content: center;
  height: ${SIZE40}px;
  aspect-ratio: 1;
  margin-top: -${SIZE16}px;
  border-radius: ${SIZE20}px;
  background-color: ${COLORS.WHITE1};
`;

const Logo = styled.Image`

`;

const LoginForm = styled.View`
  padding-vertical: ${SIZE1}px;
  padding-horizontal: ${SIZE6}px;
`;

const InputRow = styled.View`
  width: 100%;
  flex-direction: row;
  padding-vertical: ${SIZE1}px;
`;

const IconWrap = styled.View`
  height: ${SIZE10}px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE1};
  border-radius: 3px;
`;

const InputWrap = styled.View`
  flex: 1;
  height: ${SIZE10}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE1};
  border-radius: 3px;
  margin-left: ${SIZE1}px;
`;

const Input = styled.TextInput`
  width: 80%;
  padding: 0px;
  color: ${COLORS.BLACK2};
  font-size: ${FONT(15)}px;
  font-weight: 500;
`;

const CheckRow = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding-vertical: 5px;
  margin-left: ${SIZE5}px;
  padding-vertical: ${SIZE2}px;
`;

const RememberText = styled.Text`
  font-size: ${FONT(12)}px;
  color: ${COLORS.BLACK2};
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  margin-left: ${SIZE2}px;
`;

const ButtonRow = styled.View`
  margin-vertical: ${SIZE4}px;
`;

const LoginButton = styled.TouchableOpacity`
  height: ${SIZE10}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.BLUE1};
`;

const LoginText = styled.Text`
  font-size: ${FONT(18)}px;
  font-weight: 700;
  color: ${COLORS.WHITE1};
`;

export {
  Header,
  Content,
  LogoWrap,
  Logo,
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
