import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
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
  webStyle,
} from './styled';

const SignatureScreen = ({
  jobStepId,
  signs,
  setSigns,
  componentId,
}) => {
  const [ name, setName ] = useState('');
  const [ contact, setContact ] = useState('');

  const signatureRef = useRef(null);

  useEffect(() => {
    if (indexOfSign !== -1) {
      setName(signs[indexOfSign].signedUserName);
      setContact(signs[indexOfSign].signedUserContact);
    }
  }, []);

  const indexOfSign = useMemo(() => {
    const index = signs.findIndex((sign) => (
      sign.jobStepId === jobStepId
    ));

    return index;
  }, [
    jobStepId,
    signs,
  ]);

  const onClose = () => {
    dismissLightBox(componentId);
  };

  const onCloseWithClear = () => {
    const newSigns = signs.slice(0);

    if (indexOfSign !== -1) {
      newSigns.splice(indexOfSign, 1);
    }
    setSigns(newSigns);

    onClose();
  };

  const onCheck = () => {
    signatureRef.current.readSignature();
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

      const newSign = {
        jobStepId,
        uri,
        data,
        signedUserName: name,
        signedUserContact: contact,
      };
      const newSigns = signs.slice(0);

      if (indexOfSign === -1) {
        newSigns.push(newSign);
      } else {
        newSigns.splice(indexOfSign, 1, newSign);
      }
      setSigns(newSigns);

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
        onPressLeft={onCloseWithClear}
        onPressRight={onCheck}
      />
      <SignatureWrap>
        <Signature
          ref={signatureRef}
          onOK={onSign}
          webStyle={webStyle}
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
  jobStepId: PropTypes.number.isRequired,
  signs: PropTypes.array.isRequired,
  setSigns: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

export default SignatureScreen;
