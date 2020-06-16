import CheckBox from '@react-native-community/checkbox';
import styled from 'styled-components';

import {
  COLORS,
  WIDTH,
  COMMON_HEIGHT1,
} from 'src/constants';

const LogoContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: ${COMMON_HEIGHT1 * 2}px;
  aspect-ratio: 1;
  margin-top: ${-COMMON_HEIGHT1 * 0.8}px;
  border-radius: ${COMMON_HEIGHT1}px;
  background-color: ${COLORS.WHITE1};
`;

const LogoImage = styled.Image`

`;

const LoginForm = styled.View`
  padding-vertical: 5px;
  padding-horizontal: ${WIDTH * 0.12}px;
`;

const InputRow = styled.View`
  width: 100%;
  flex-direction: row;
  padding-vertical: 5px;
`;

const IconWrap = styled.View`
  height: ${COMMON_HEIGHT1 / 2}px;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE1};
  border-radius: 3px;
`;

const InputWrap = styled.View`
  flex: 1;
  height: ${COMMON_HEIGHT1 / 2}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE1};
  border-radius: 3px;
  margin-left: 5px;
`;

const Input = styled.TextInput`
  width: 80%;
  padding: 0px;
  color: ${COLORS.BLACK2};
  font-size: 15px;
`;

const CheckRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding-vertical: 5px;
`;

const Check = styled(CheckBox)`
  margin-left: 20px;
  margin-right: 5px;
`;

const RememberText = styled.Text`
  color: ${COLORS.BLACK2};
`;

const ButtonRow = styled.View`
  margin-vertical: 15px;
`;

const LoginButton = styled.TouchableOpacity`
  height: ${COMMON_HEIGHT1 / 2}px;
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
  Check,
  RememberText,
  ButtonRow,
  LoginButton,
  LoginText,
};
