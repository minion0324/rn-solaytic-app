import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  pushMultiScreensApp,
} from 'src/navigation';
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
  RememberText,
  ButtonRow,
  LoginButton,
  LoginText,
} from './styled';

const {
  UserIcon,
  LockIcon,
  DeactiveCheckIcon,
  GrayActiveCheckIcon,
} = SVGS;

const LoginScreen = ({ componentId }) => {
  const [ rememberCheck, setRememberCheck ] = useState(false);

  const toLogin = () => {
    pushMultiScreensApp();
  }

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
          <CheckRow onPress={() => setRememberCheck(!rememberCheck)}>
            {
              rememberCheck
              ? <GrayActiveCheckIcon />
              : <DeactiveCheckIcon />
            }
            <RememberText active={rememberCheck}>Remember me</RememberText>
          </CheckRow>
          <ButtonRow>
            <ShadowContainer>
              <LoginButton onPress={toLogin}>
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
