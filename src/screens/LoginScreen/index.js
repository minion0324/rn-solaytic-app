import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import {
  pushMultiScreensApp,
} from 'src/navigation';
import {
  SVGS,
  IMAGES,
  COLORS,
} from 'src/constants';
import {
  DefaultButton,
} from 'src/components';
import { User } from 'src/redux';

import {
  Container,
} from 'src/styles/common.styles';

import {
  Content,
  LogoWrap,
  Logo,
  FormWrap,
  InputRow,
  InputWrap,
  Input,
  LeftWrap,
  RightWrap,
  RememberWrap,
  RememberText,
  ButtonWrap,
  PoweredByText,
} from './styled';

const {
  UserIcon,
  LockIcon,
  ActiveCheckIcon,
  DeactiveCheckIcon,
  VisibilityOnIcon,
  VisibilityOffIcon,
} = SVGS;

const LoginScreen = ({
  isRehydrated,
  token,
  appLogo,
  rememberedUser,
  login,
  setRememberedUser,
  authToken,
  fetch,
}) => {
  const inputUserName = useRef(null);
  const inputPassword = useRef(null);

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberCheck, setRememberCheck] = useState(false);
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (!isRehydrated) return;

    if (rememberedUser) {
      setRememberCheck(true);
      setUserName(rememberedUser);
    }

    if (token) {
      onAuthToken();
    }
  }, [isRehydrated]);

  const onSuccess = () => {
    setLoading(false);

    setRememberedUser(rememberCheck ? userName : '');

    pushMultiScreensApp();
  };

  const onFailure = () => {
    setLoading(false);
  };

  const onFetch = () => {
    fetch({
      success: onSuccess,
      failure: onFailure,
    });
  };

  const onAuthToken = () => {
    setLoading(true);

    authToken({
      token,
      success: onFetch,
      failure: onFailure,
    });
  }

  const onLogin = () => {
    if (!userName) {
      Alert.alert('Warning', 'Please enter username.');
      return;
    }

    if (!password) {
      Alert.alert('Warning', 'Please enter password.');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    login({
      userName,
      password,
      persistToken: rememberCheck,
      success: onFetch,
      failure: onFailure,
    });
  };

  const onChangeUserName = (text) => {
    setUserName(text);
  };

  const onChangePassword = (text) => {
    setPassword(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      flex={1}>
      <Container>
        <Content>
          <LogoWrap>
            <Logo
              resizeMode={'contain'}
              source={
                appLogo ? { uri: appLogo } : IMAGES.APP_LOGO
              }
            />
          </LogoWrap>

          <FormWrap>
            <InputRow>
              <LeftWrap>
                <UserIcon />
              </LeftWrap>
              <InputWrap>
                <Input
                  ref={inputUserName}
                  placeholder={'Username'}
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  returnKeyType={'next'}
                  onSubmitEditing={() => inputPassword.current.focus()}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={text => onChangeUserName(text)}
                  value={userName}
                />
                <RightWrap />
              </InputWrap>
            </InputRow>

            <InputRow>
              <LeftWrap>
                <LockIcon />
              </LeftWrap>
              <InputWrap>
                <Input
                  ref={inputPassword}
                  placeholder={'Password'}
                  secureTextEntry={!visibility}
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  returnKeyType={'go'}
                  onSubmitEditing={onLogin}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={text => onChangePassword(text)}
                  value={password}
                />
                <RightWrap
                  onPress={() => setVisibility(!visibility)}
                >
                  {
                    visibility
                      ? <VisibilityOnIcon />
                      : <VisibilityOffIcon />
                  }
                </RightWrap>
              </InputWrap>
            </InputRow>

            <RememberWrap onPress={() => setRememberCheck(!rememberCheck)}>
              {
                rememberCheck
                  ? <ActiveCheckIcon />
                  : <DeactiveCheckIcon />
              }
              <RememberText>Remember me</RememberText>
            </RememberWrap>

            <ButtonWrap>
              <DefaultButton
                onPress={onLogin}
                text={'Sign in'}
                color={COLORS.BLUE1}
                loading={loading}
              />
            </ButtonWrap>
          </FormWrap>

          <PoweredByText>
            Powered by wasteporter.com
          </PoweredByText>
        </Content>
      </Container>
    </KeyboardAvoidingView>
  );
};

LoginScreen.propTypes = {
  isRehydrated: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  appLogo: PropTypes.string.isRequired,
  rememberedUser: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  setRememberedUser: PropTypes.func.isRequired,
  authToken: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isRehydrated: User.selectors.getIsRehydrated(state),
    token: User.selectors.getToken(state),
    appLogo: User.selectors.getAppLogo(state),
    rememberedUser: User.selectors.getRememberedUser(state),
  };
};

const mapDispatchToProps = {
  login: User.actionCreators.login,
  setRememberedUser: User.actionCreators.setRememberedUser,
  authToken: User.actionCreators.authToken,
  fetch: User.actionCreators.fetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
