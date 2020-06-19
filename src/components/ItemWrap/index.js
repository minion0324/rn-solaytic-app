import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE2,
} from 'src/constants';

import {
  ShadowWrap,
} from 'src/styles/common.styles';

const Container = styled.TouchableOpacity`
  background-color: ${COLORS.WHITE1};
  margin-left: ${props => props.mLeft}px;
  margin-top: ${props => props.mTop}px;
  margin-right: ${props => props.mRight}px;
  margin-bottom: ${props => props.mBottom}px;
  border-radius: 3px;
  border-width: 1px;
  border-color: ${(props) => (
    props.activated ? COLORS.BLUE1 : COLORS.WHITE1
  )};
`;

const ItemWrap = ({
  children,
  onPress,
  activated,
  deactivated,
  mLeft,
  mTop,
  mRight,
  mBottom,
}) => {
  return (
    <Container
      onPress={onPress}
      disabled={!onPress}
      activated={activated}
      mLeft={mLeft}
      mTop={mTop}
      mRight={mRight}
      mBottom={mBottom}
    >
      {
        deactivated
        ? children
        : <ShadowWrap>
            {children}
          </ShadowWrap>
      }
    </Container>
  );
};

ItemWrap.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  activated: PropTypes.bool,
  deactivated: PropTypes.bool,
  mLeft: PropTypes.number,
  mTop: PropTypes.number,
  mRight: PropTypes.number,
  mBottom: PropTypes.number,
};

ItemWrap.defaultProps = {
  onPress: null,
  activated: false,
  deactivated: false,
  mLeft: SIZE2,
  mTop: SIZE2,
  mRight: SIZE2,
  mBottom: SIZE2,
};

export default ItemWrap;
