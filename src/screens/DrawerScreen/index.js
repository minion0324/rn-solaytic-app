import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  dismissDrawer,
  pushScreen,
  pushSingleScreenApp,
  UPLOAD_HISTORY_SCREEN,
} from 'src/navigation';
import {
  SVGS,
  COLORS,
  COMPLETE_JOBS_KEY,
} from 'src/constants';
import {
  User,
  ViewStore,
} from 'src/redux';
import {
  cleanCache,
} from 'src/utils';

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
  coreScreenInfo,
  logout,
  componentId,
}) => {
  const closeDrawer = () => {
    dismissDrawer(componentId);
  };

  const onLogout = async () => {
    try {
      await cleanCache(COMPLETE_JOBS_KEY);

      logout();
      pushSingleScreenApp();
    } catch (error) {
      //
    }
  };

  const onUploadHistory = () => {
    pushScreen(
      coreScreenInfo.componentId,
      UPLOAD_HISTORY_SCREEN,
    );

    closeDrawer();
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
            <TouchableOpacity onPress={closeDrawer}>
              <CloseIcon />
            </TouchableOpacity>
          </ProfileWrap>

          <ItemWrap>
            <Item onPress={() => {}}>
              <ItemText>Help & Support</ItemText>
            </Item>
          </ItemWrap>
          <ItemWrap>
            <Item onPress={() => {}}>
              <ItemText>Send Feedback</ItemText>
            </Item>
          </ItemWrap>
          <ItemWrap>
            <Item onPress={onUploadHistory}>
              <ItemText>Upload History</ItemText>
            </Item>
          </ItemWrap>

          <VersionWrap>
            <VersionText>v 2.3.11</VersionText>
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
  coreScreenInfo: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
    coreScreenInfo: ViewStore.selectors.getCoreScreenInfo(state),
  };
};

const mapDispatchToProps = {
  logout: User.actionCreators.logout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrawerScreen);
