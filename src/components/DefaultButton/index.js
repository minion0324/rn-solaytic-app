import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE8,
  FONT,
} from 'src/constants';

import {
  RowWrap,
  SpaceView,
} from 'src/styles/common.styles';

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
  color: ${props => props.color};
  text-transform: uppercase;
`;

const DefaultButton = ({
  text,
  color,
  onPress,
  textColor,
  loading,
  icon,
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
        ? <ActivityIndicator
            size={'small'}
            color={textColor}
          />
        : <RowWrap>
            {
              !!icon &&
              <RowWrap>
                { icon }
                <SpaceView mLeft={SIZE2} />
              </RowWrap>
            }
            <ButtonText
              color={textColor}
            >
              {text}
            </ButtonText>
          </RowWrap>
      }
    </Button>
  );
}

DefaultButton.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  textColor: PropTypes.string,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  mLeft: PropTypes.number,
  mTop: PropTypes.number,
  mRight: PropTypes.number,
  mBottom: PropTypes.number,
};

DefaultButton.defaultProps = {
  onPress: null,
  textColor: COLORS.WHITE1,
  loading: false,
  icon: null,
  mLeft: 0,
  mTop: 0,
  mRight: 0,
  mBottom: 0,
};

export default DefaultButton;
