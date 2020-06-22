import React from 'react';
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
  Content,
  ItemRow,
  InfoText,
  Button,
  ButtonText,
  IconWrap,
  InfoRow,
} from './styled';

const { AccountIcon, KeyIcon } = SVGS;

const ProfileScreen = ({ componentId }) => {
  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Settings</ScreenText>}
        />
      </ShadowWrap>
      <Content>
        <ItemRow>
          <InfoRow>
            <IconWrap><AccountIcon /></IconWrap>
            <InfoText>William Tan</InfoText>
          </InfoRow>
          <Button>
            <ButtonText>Log Out</ButtonText>
          </Button>
        </ItemRow>

        <ItemRow>
          <InfoRow>
            <IconWrap><KeyIcon /></IconWrap>
            <InfoText>XB 1234 K</InfoText>
          </InfoRow>
          <Button>
            <ButtonText>Change</ButtonText>
          </Button>
        </ItemRow>
      </Content>
      <BottomBar componentId={componentId} activeIndex={2} />
    </Container>
  );
};

ProfileScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default ProfileScreen;
