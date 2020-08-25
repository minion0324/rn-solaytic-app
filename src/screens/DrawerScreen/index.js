import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  dismissDrawer,
  pushSingleScreenApp,
} from 'src/navigation';
import {
  SVGS,
  COLORS,
} from 'src/constants';
import { User } from 'src/redux';

import {
  Container,
} from 'src/styles/common.styles';

import {
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
} from './styled';

const { AvatarIcon, CloseIcon } = SVGS;

const DrawerScreen = ({
  driverName,
  logout,
  componentId,
}) => {
  const onLogout = () => {
    logout();
    pushSingleScreenApp();
  };

  return (
    <Container color={COLORS.WHITE1}>
      <Content>
        <MainWrap>
          <ProfileWrap>
            <Profile>
              <AvatarIcon />
              <UserName>{driverName}</UserName>
            </Profile>
            <TouchableOpacity
              onPress={() => dismissDrawer(componentId)}
            >
              <CloseIcon />
            </TouchableOpacity>
          </ProfileWrap>
          {
            ['Help & Support', 'Send Feedback', 'Upload History'].map((item) => (
              <ItemWrap key={item}>
                <Item>
                  <ItemText>{item}</ItemText>
                </Item>
              </ItemWrap>
            ))
          }
          <VersionWrap>
            <VersionText>v 2.2</VersionText>
          </VersionWrap>
        </MainWrap>
        <LogoutButton onPress={onLogout}>
          <LogoutText>Log Out</LogoutText>
        </LogoutButton>
      </Content>
    </Container>
  );
};

DrawerScreen.propTypes = {
  driverName: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
  };
};

const mapDispatchToProps = {
  logout: User.actionCreators.logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrawerScreen);
