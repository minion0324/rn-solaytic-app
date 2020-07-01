import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  pushSingleScreenApp,
} from 'src/navigation';
import {
  HeaderBar,
  BottomBar,
} from 'src/components';
import {
  SVGS,
} from 'src/constants';
import { User } from 'src/redux';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
} from 'src/styles/header.styles';

import {
  Profile,
  Content,
  UserNameWrap,
  UserNameText,
  UserName,
  LogoutButton,
  LogoutText,
} from './styled';

const { AvatarIcon } = SVGS;

const ProfileScreen = ({
  driverName,
  logout,
  componentId,
}) => {
  const onLogout = () => {
    logout();
    pushSingleScreenApp();
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Settings</ScreenText>}
        />
      </ShadowWrap>

      <ScrollView>
        <Profile>
          <ShadowWrap>
            <Content>
              <AvatarIcon />
              <UserNameWrap>
                <UserNameText>Username</UserNameText>
                <UserName>{driverName}</UserName>
              </UserNameWrap>
              <LogoutButton onPress={onLogout}>
                <LogoutText>Log Out</LogoutText>
              </LogoutButton>
            </Content>
          </ShadowWrap>
        </Profile>
      </ScrollView>

      <BottomBar componentId={componentId} activeIndex={2} />
    </Container>
  );
};

ProfileScreen.propTypes = {
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
)(ProfileScreen);
