import React, { useState } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import Signature from 'react-native-signature-canvas';
import RNFS from 'react-native-fs';
import moment from 'moment';

import {
  dismissOverlay,
} from 'src/navigation';
import {
  HeaderBar,
  OverlayWrap,
} from 'src/components';
import {
  PLATFORM,
  COLORS,
} from 'src/constants';

import {
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
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

  const onBack = () => {
    dismissOverlay(componentId);
  };

  const onSign = async (signature) => {
    try {
      if (!name || !contact) {
        Alert.alert('Warning', 'Please type signed user name & contact.');
        return;
      }

      const uri = PLATFORM === 'ios' ? '' : 'file://' +
        RNFS.DocumentDirectoryPath + `/sign${moment().format('x')}.jpg`;
      const data = signature.replace('data:image/png;base64,', '');

      await RNFS.writeFile(uri, data, 'base64');

      setSign({ uri, data });

      setSignedUserName(name);
      setSignedUserContact(contact);

      onBack();
    } catch (error) {
      //
    }
  };

  return (
    <OverlayWrap dismissOverlay={onBack}>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Signature</ScreenText>}
        />
      </ShadowWrap>
      <InfoWrap>
        <NameWrap>
          <Input
            placeholder={'Name'}
            underlineColorAndroid={COLORS.TRANSPARENT1}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={text => setName(text)}
            value={name}
          />
        </NameWrap>
        <ContactWrap>
          <Input
            placeholder={'Contact'}
            underlineColorAndroid={COLORS.TRANSPARENT1}
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
    </OverlayWrap>
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
