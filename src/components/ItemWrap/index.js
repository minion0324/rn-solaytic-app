import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
} from 'src/constants';

const Container = styled.View`
  margin-left: ${props => props.mLeft}px;
  margin-top: ${props => props.mTop}px;
  margin-right: ${props => props.mRight}px;
  margin-bottom: ${props => props.mBottom}px;
`;

const TouchWrap = styled.TouchableOpacity`
  background-color: ${COLORS.WHITE1};
  overflow: hidden;
  border-radius: 3px;
  border-width: 1px;
  border-color: ${(props) => (
    props.activated ? COLORS.BLUE1 : COLORS.WHITE1
  )};
  elevation: ${(props) => (
    props.deactivated ? 0 : 10
  )};
  box-shadow: 0px 8px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
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
      mLeft={mLeft}
      mTop={mTop}
      mRight={mRight}
      mBottom={mBottom}
    >
      <TouchWrap
        activated={activated}
        deactivated={deactivated}
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
