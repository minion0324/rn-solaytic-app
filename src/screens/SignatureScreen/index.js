import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import Signature from 'react-native-signature-canvas';
import RNFS from 'react-native-fs';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';

import {
  popScreen,
} from 'src/navigation';
import {
  HeaderBar,
} from 'src/components';
import {
  PLATFORM,
  COLORS,
} from 'src/constants';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
} from 'src/styles/header.styles';

import {
  InfoWrap,
  NameWrap,
  ContactWrap,
  SignatureWrap,
  Input,
} from './styled';

const SignatureScreen = ({
  setSign,
  signedUserName,
  setSignedUserName,
  signedUserContact,
  setSignedUserContact,
  componentId,
}) => {
  const [ name, setName ] = useState(signedUserName);
  const [ contact, setContact ] = useState(signedUserContact);

  useEffect(() => {
    setTimeout(() => {
      Orientation.lockToLandscape();
    }, PLATFORM === 'ios' ? 1000 : 0);

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onSign = async (base64) => {
    try {
      if (!name || !contact) {
        Alert.alert('Warning', 'Please type signed user name & contact.');
        return;
      }

      const path = PLATFORM === 'ios' ? '' : 'file://' +
        RNFS.DocumentDirectoryPath + `/sign${moment().format('x')}.jpg`;
      await RNFS.writeFile(path, base64.replace('data:image/png;base64,', ''), 'base64');

      setSign(path);
      setSignedUserName(name);
      setSignedUserContact(contact);

      onBack();
    } catch (error) {
      //
    }
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Signature</ScreenText>}
          leftIcon={<BackButton />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>
      <InfoWrap>
        <NameWrap>
          <Input
            placeholder={'Name'}
            underlineColorAndroid={COLORS.TRANSPARENT}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={text => setName(text)}
            value={name}
          />
        </NameWrap>
        <ContactWrap>
          <Input
            placeholder={'Contact'}
            underlineColorAndroid={COLORS.TRANSPARENT}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={text => setContact(text)}
            value={contact}
          />
        </ContactWrap>
      </InfoWrap>
      <SignatureWrap>
        <Signature
          onOK={onSign}
        />
      </SignatureWrap>
    </Container>
  );
};

SignatureScreen.propTypes = {
  setSign: PropTypes.func.isRequired,
  signedUserName: PropTypes.string,
  setSignedUserName: PropTypes.func.isRequired,
  signedUserContact: PropTypes.string,
  setSignedUserContact: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

SignatureScreen.defaultProps = {
  signedUserName: '',
  signedUserContact: '',
};

export default SignatureScreen;
