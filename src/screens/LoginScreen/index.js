import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  pushMultiScreensApp,
} from 'src/navigation';
import {
  SVGS,
  IMAGES,
  COLORS,
} from 'src/constants';
import { User } from 'src/redux';

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

const LoginScreen = ({
  isRehydrated,
  token,
  rememberedUser,
  login,
  setRememberedUser,
}) => {
  const inputUserName = useRef(null);
  const inputPassword = useRef(null);

  const [ loading, setLoading ] = useState(false);
  const [ userName, setUserName ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ rememberCheck, setRememberCheck ] = useState(false);

  useEffect(() => {
    if (rememberedUser) {
      setRememberCheck(true);
      setUserName(rememberedUser);
    }
  }, [isRehydrated]);

  const onLoginSuccess = () => {
    setLoading(false);

    setRememberedUser(rememberCheck ? userName : '');

    pushMultiScreensApp();
  };

  const onLoginFailure = (error) => {
    setLoading(false);
  };

  const onLogin = () => {
    if (loading) return;

    setLoading(true);

    login({
      userName,
      password,
      success: onLoginSuccess,
      failure: onLoginFailure,
    });
  };

  const onChangeUserName = (text) => {
    setUserName(text);
  };

  const onChangePassword = (text) => {
    setPassword(text);
  };

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
                ref={inputUserName}
                underlineColorAndroid={COLORS.TRANSPARENT}
                returnKeyType={'next'}
                onSubmitEditing={() => inputPassword.current.focus()}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={text => onChangeUserName(text)}
                value={userName}
              />
            </InputWrap>
          </InputRow>
          <InputRow>
            <IconWrap><LockIcon /></IconWrap>
            <InputWrap>
              <Input
                ref={inputPassword}
                secureTextEntry={true}
                underlineColorAndroid={COLORS.TRANSPARENT}
                returnKeyType={'go'}
                onSubmitEditing={onLogin}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={text => onChangePassword(text)}
                value={password}
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
              <LoginButton onPress={onLogin}>
                {
                  loading
                  ? <ActivityIndicator size={'small'} color={COLORS.WHITE1} />
                  : <LoginText>SIGN IN</LoginText>
                }
              </LoginButton>
            </ShadowWrap>
          </ButtonRow>
        </LoginForm>
      </Content>
    </Container>
  );
};

LoginScreen.propTypes = {
  isRehydrated: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  rememberedUser: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  setRememberedUser: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isRehydrated: User.selectors.getIsRehydrated(state),
    token: User.selectors.getToken(state),
    rememberedUser: User.selectors.getRememberedUser(state),
  };
};

const mapDispatchToProps = {
  login: User.actionCreators.login,
  setRememberedUser: User.actionCreators.setRememberedUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
