import React from 'react';
import PropTypes from 'prop-types';

import {
  SVGS,
  IMAGES,
  COLORS,
} from 'src/constants';

import {
  Container,
  HeaderContainer,
  ContentContainer,
  ShadowContainer,
} from 'src/styles/common.styles';

import {
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
} from './styled';

const { UserIcon, LockIcon } = SVGS;

const LoginScreen = ({ componentId }) => {
  return (
    <Container>
      <ShadowContainer>
        <HeaderContainer />
      </ShadowContainer>

      <ContentContainer>
        <LogoContainer>
          <LogoImage source={IMAGES.APP_LOGO} />
        </LogoContainer>
        <LoginForm>
          <InputRow>
            <IconWrap><UserIcon /></IconWrap>
            <InputWrap>
              <Input
                underlineColorAndroid={COLORS.TRANSPARENT}
              />
            </InputWrap>
          </InputRow>
          <InputRow>
            <IconWrap><LockIcon /></IconWrap>
            <InputWrap>
              <Input
                secureTextEntry={true}
                underlineColorAndroid={COLORS.TRANSPARENT}
              />
            </InputWrap>
          </InputRow>
          <CheckRow>
            <Check
              tintColors={{ true: COLORS.GRAY1, false: COLORS.GRAY1 }}
            />
            <RememberText>Remember me</RememberText>
          </CheckRow>
          <ButtonRow>
            <ShadowContainer>
              <LoginButton>
                <LoginText>SIGN IN</LoginText>
              </LoginButton>
            </ShadowContainer>
          </ButtonRow>
        </LoginForm>
      </ContentContainer>
    </Container>
  );
};

LoginScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default LoginScreen;
