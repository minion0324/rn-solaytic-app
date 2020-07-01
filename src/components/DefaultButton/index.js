import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE8,
  FONT,
} from 'src/constants';

const Button = styled.TouchableOpacity`
  width: 100%;
  height: ${SIZE8}px;
  background-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  border-radius: ${SIZE1}px;
  margin-left: ${props => props.mLeft}px;
  margin-top: ${props => props.mTop}px;
  margin-right: ${props => props.mRight}px;
  margin-bottom: ${props => props.mBottom}px;
`;

const ButtonText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.WHITE1};
  text-transform: uppercase;
`;

const DefaultButton = ({
  text,
  color,
  onPress,
  loading,
  mLeft,
  mTop,
  mRight,
  mBottom,
}) => {
  return (
    <Button
      onPress={onPress}
      disabled={!onPress || loading}

      color={color}
      mLeft={mLeft}
      mTop={mTop}
      mRight={mRight}
      mBottom={mBottom}
    >
      {
        loading
        ? <ActivityIndicator size={'small'} color={COLORS.WHITE1} />
        : <ButtonText>{text}</ButtonText>
      }
    </Button>
  );
}

DefaultButton.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  mLeft: PropTypes.number,
  mTop: PropTypes.number,
  mRight: PropTypes.number,
  mBottom: PropTypes.number,
};

DefaultButton.defaultProps = {
  onPress: null,
  loading: false,
  mLeft: 0,
  mTop: 0,
  mRight: 0,
  mBottom: 0,
};

export default DefaultButton;
