import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import {
  HeaderBar,
  BottomBar,
} from 'src/components';
import {
  SVGS,
} from 'src/constants';

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

const ProfileScreen = ({ componentId }) => {
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
                <UserName>Wayne</UserName>
              </UserNameWrap>
              <LogoutButton>
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
  componentId: PropTypes.string.isRequired,
};

export default ProfileScreen;
