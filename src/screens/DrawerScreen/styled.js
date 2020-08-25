import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE8,
  SIZE30,
  FONT,
} from 'src/constants';

const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const MainWrap = styled.View`
  width: 100%;
`;

const ProfileWrap = styled.View`
  padding: ${SIZE4}px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-color: ${COLORS.GRAY2};
`;

const Profile = styled.View`
  align-items: center;
`;

const UserName = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  margin-top: ${SIZE1}px;
`;

const ItemWrap = styled.View`
  border-bottom-width: 1px;
  border-color: ${COLORS.GRAY2};
`;

const Item = styled.TouchableOpacity`
  padding-vertical: ${SIZE3}px;
  padding-horizontal: ${SIZE4}px;
`;

const ItemText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const VersionWrap = styled.View`
  padding-vertical: ${SIZE2}px;
  padding-horizontal: ${SIZE4}px;
`;

const VersionText = styled.Text`
  font-size: ${FONT(10)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const LogoutButton = styled.TouchableOpacity`
  width: ${SIZE30}px;
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
  border-radius: ${SIZE1}px;
  border-width: 1px;
  border-color: ${COLORS.GRAY3};
  margin-vertical: ${SIZE4}px;
`;

const LogoutText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.GRAY3};
`;

export {
  Content,
  MainWrap,
  ProfileWrap,
  Profile,
  UserName,
  ItemWrap,
  Item,
  ItemText,
  VersionWrap,
  VersionText,
  LogoutButton,
  LogoutText,
};
