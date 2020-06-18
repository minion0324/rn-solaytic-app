import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
} from 'src/constants';

import {
  ShadowWrap,
} from 'src/styles/common.styles';

const Container = styled.TouchableOpacity`
  background-color: ${COLORS.WHITE1};
  margin: ${COMMON_PADDING}px;
`;

const ItemWrap = ({
  children,
  onPress,
}) => {
  return (
    <Container
      onPress={onPress}
      disabled={!onPress}
    >
      <ShadowWrap>
        {children}
      </ShadowWrap>
    </Container>
  );
};

ItemWrap.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
};

ItemWrap.defaultProps = {
  onPress: null,
};

export default ItemWrap;