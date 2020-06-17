import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
} from 'src/constants';

const Container = styled.View`
  width: 100%;
  height: ${COMMON_SIZE * 0.6}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.BLUE1};
  padding-left: ${COMMON_PADDING}px;
  padding-right: ${COMMON_PADDING * 2}px;
`;

const CenterIconWrap = styled.View`

`;

const LeftIconWrap = styled.TouchableOpacity`

`;

const RightIconWrap = styled.TouchableOpacity`

`;

const Header = ({
  centerIcon,
  leftIcon,
  onPressLeft,
  rightIcon,
  onPressRight,
}) => {
  return (
    <Container>
      <LeftIconWrap
        onPress={onPressLeft}
        disabled={!onPressLeft}
      >
        { leftIcon }
      </LeftIconWrap>

      <CenterIconWrap>
        {centerIcon}
      </CenterIconWrap>

      <RightIconWrap
        onPress={onPressRight}
        disabled={!onPressRight}
      >
        { rightIcon }
      </RightIconWrap>
    </Container>
  );
}

Header.propTypes = {
  centerIcon: PropTypes.node,
  leftIcon: PropTypes.node,
  onPressLeft: PropTypes.func,
  rightIcon: PropTypes.node,
  onPressRight: PropTypes.func,
}

Header.defaultProps = {
  centerIcon: null,
  leftIcon: null,
  onPressLeft: null,
  rightIcon: null,
  onPressRight: null,
}

export default Header;
