import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  SIZE12,
  SIZE2,
  SIZE4,
} from 'src/constants';

const Container = styled.View`
  width: 100%;
  height: ${SIZE12}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.color || COLORS.WHITE2};
  padding-left: ${SIZE2}px;
  padding-right: ${SIZE4}px;
`;

const CenterIconWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LeftIconWrap = styled.TouchableOpacity`

`;

const RightIconWrap = styled.TouchableOpacity`

`;

const HeaderBar = ({
  color,
  centerIcon,
  leftIcon,
  onPressLeft,
  rightIcon,
  onPressRight,
}) => {
  return (
    <Container color={color}>
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

HeaderBar.propTypes = {
  color: PropTypes.string,
  centerIcon: PropTypes.node,
  leftIcon: PropTypes.node,
  onPressLeft: PropTypes.func,
  rightIcon: PropTypes.node,
  onPressRight: PropTypes.func,
}

HeaderBar.defaultProps = {
  color: '',
  centerIcon: null,
  leftIcon: null,
  onPressLeft: null,
  rightIcon: null,
  onPressRight: null,
}

export default HeaderBar;
