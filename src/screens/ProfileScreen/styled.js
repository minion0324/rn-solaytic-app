import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE5,
  SIZE6,
  SIZE10,
  SIZE30,
  FONT,
} from 'src/constants';

const Profile = styled.View`
  margin-vertical: ${SIZE5}px;
  margin-horizontal: ${SIZE2}px;
`;

const Content = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: ${SIZE6}px;
  background-color: ${COLORS.WHITE1};
`;

const UserNameWrap = styled.View`
  margin-vertical: ${SIZE5}px;
  align-items: center;
  justify-content: center;
`;

const UserNameText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.GRAY3};
`;

const UserName = styled.Text`
  font-size: ${FONT(18)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
`;

const LogoutButton = styled.TouchableOpacity`
  width: ${SIZE30}px;
  height: ${SIZE10}px;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border-width: 1px;
  border-color: ${COLORS.BLUE1};
`;

const LogoutText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLUE1};
`;

export {
  Profile,
  Content,
  UserNameWrap,
  UserNameText,
  UserName,
  LogoutButton,
  LogoutText,
};
