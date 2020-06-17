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
  ShadowWrap,
} from 'src/styles/common.styles';

import {
  Header,
  Content,
  LogoWrap,
  Logo,
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
      <ShadowWrap>
        <Header />
      </ShadowWrap>

      <Content>
        <LogoWrap>
          <Logo source={IMAGES.APP_LOGO} />
        </LogoWrap>
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
            <ShadowWrap>
              <LoginButton onPress={toLogin}>
                <LoginText>SIGN IN</LoginText>
              </LoginButton>
            </ShadowWrap>
          </ButtonRow>
        </LoginForm>
      </Content>
    </Container>
  );
};

LoginScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default LoginScreen;
