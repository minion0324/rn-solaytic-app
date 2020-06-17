import React from 'react';
import PropTypes from 'prop-types';

import {
  Header,
} from 'src/components';
import {
  SVGS,
} from 'src/constants';

import {
  Container,
  ShadowWrap,
  HeaderTitle,
} from 'src/styles/common.styles';

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
        <Header
          centerIcon={<HeaderTitle>SETTINGS</HeaderTitle>}
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
    </Container>
  );
};

ProfileScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default ProfileScreen;
