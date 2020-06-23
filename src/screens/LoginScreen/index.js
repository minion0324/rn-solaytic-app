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
} from 'src/styles/common.styles';

import {
  Content,
  Logo,
  InputWrap,
  Input,
  LeftWrap,
  RightWrap,
  RememberWrap,
  RememberText,
  ButtonWrap,
  LoginButton,
  LoginText,
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
  const [ visibility, setVisibility ] = useState(false);

  useEffect(() => {
    if (rememberedUser) {
      setRememberCheck(true);
      setUserName(rememberedUser);
    }
  }, [isRehydrated]);

  const onLoginSuccess = () => {
    // setLoading(false);

    // setRememberedUser(rememberCheck ? userName : '');

    pushMultiScreensApp();
  };

  const onLoginFailure = (error) => {
    setLoading(false);
  };

  const onLogin = () => {
    if (loading) return;

    setLoading(true);

    onLoginSuccess();

    // login({
    //   userName,
    //   password,
    //   success: onLoginSuccess,
    //   failure: onLoginFailure,
    // });
  };

  const onChangeUserName = (text) => {
    setUserName(text);
  };

  const onChangePassword = (text) => {
    setPassword(text);
  };

  return (
    <Container color={COLORS.WHITE1}>
      <Content>
        <Logo source={IMAGES.APP_LOGO} />

        <InputWrap>
          <LeftWrap>
            <UserIcon />
          </LeftWrap>
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
          <RightWrap />
        </InputWrap>

        <InputWrap>
          <LeftWrap>
            <LockIcon />
          </LeftWrap>
          <Input
            ref={inputPassword}
            secureTextEntry={!visibility}
            underlineColorAndroid={COLORS.TRANSPARENT}
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

        <RememberWrap onPress={() => setRememberCheck(!rememberCheck)}>
          {
            rememberCheck
            ? <ActiveCheckIcon />
            : <DeactiveCheckIcon />
          }
          <RememberText>Remember me</RememberText>
        </RememberWrap>

        <ButtonWrap>
          <LoginButton onPress={onLogin}>
            {
              loading
              ? <ActivityIndicator size={'small'} color={COLORS.WHITE1} />
              : <LoginText>SIGN IN</LoginText>
            }
          </LoginButton>
        </ButtonWrap>
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
