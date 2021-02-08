import React, { useState } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import Signature from 'react-native-signature-canvas';
import RNFS from 'react-native-fs';

import {
  dismissLightBox,
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
  getTimestamp,
} from 'src/utils';

import {
  ScreenText,
  Close,
  Check,
} from 'src/styles/header.styles';
import {
  BorderView,
} from 'src/styles/common.styles';
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

  const onClose = () => {
    dismissLightBox(componentId);
  };

  const onCheck = () => {

  };

  const onSign = async (signature) => {
    try {
      if (!name || !contact) {
        Alert.alert('Warning', 'Please type signed user name & contact.');
        return;
      }

      const uri = (PLATFORM === 'ios' ? '' : 'file://') +
        RNFS.DocumentDirectoryPath + `/sign${getTimestamp()}.jpg`;
      const data = signature.replace('data:image/png;base64,', '');

      await RNFS.writeFile(uri, data, 'base64');

      setSign({ uri, data });

      setSignedUserName(name);
      setSignedUserContact(contact);

      onClose();
    } catch (error) {
      //
    }
  };

  return (
    <OverlayWrap
      dismissOverlay={onClose}
      color={COLORS.WHITE1}
    >
      <HeaderBar
        centerIcon={
          <ScreenText>Receiver Signature</ScreenText>
        }
        leftIcon={<Close />}
        rightIcon={<Check />}
        onPressLeft={onClose}
        onPressRight={onCheck}
      />
        <SignatureWrap>
          <Signature
            onOK={onSign}
          />
        </SignatureWrap>
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
            <BorderView
              color={COLORS.BLUE1}
            />
          </NameWrap>
          <ContactWrap>
            <Input
              placeholder={'Contact number'}
              underlineColorAndroid={COLORS.TRANSPARENT1}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={text => setContact(text)}
              value={contact}
            />
            <BorderView
              color={COLORS.BLUE1}
            />
          </ContactWrap>
        </InfoWrap>
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
