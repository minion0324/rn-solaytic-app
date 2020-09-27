import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
} from 'src/constants';

const Container = styled.View`
  width: 100%;
  padding-left: ${props => props.mLeft}px;
  padding-top: ${props => props.mTop}px;
  padding-right: ${props => props.mRight}px;
  padding-bottom: ${props => props.mBottom}px;
`;

const TouchWrap = styled.TouchableOpacity`
  background-color: ${COLORS.WHITE1};
  border-radius: ${SIZE1}px;
  border-width: 1px;
  border-color: ${(props) => (
    props.activated ? props.activeColor : COLORS.TRANSPARENT1
  )};
  elevation: ${(props) => (
    props.deactivated ? 0 : 10
  )};
  z-index: ${(props) => (
    props.deactivated ? 0 : 1
  )};
  box-shadow: 0px 8px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: ${(props) => (
    props.deactivated ? 0 : 0.1
  )};
  shadow-radius: 4px;
  overflow: hidden;
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
  activeColor,
}) => {
  return (
    <Container
      mLeft={mLeft}
      mTop={mTop}
      mRight={mRight}
      mBottom={mBottom}
    >
      <TouchWrap
        activated={activated}
        deactivated={deactivated}
        activeColor={activeColor}
        onPress={onPress}
        disabled={!onPress}
      >
        {children}
      </TouchWrap>
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
  activeColor: PropTypes.string,
};

ItemWrap.defaultProps = {
  onPress: null,
  activated: false,
  deactivated: false,
  mLeft: SIZE2,
  mTop: SIZE2,
  mRight: SIZE2,
  mBottom: SIZE2,
  activeColor: COLORS.BLUE1,
};

export default ItemWrap;
