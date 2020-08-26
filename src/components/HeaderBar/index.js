import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  SIZE2,
  SIZE12,
} from 'src/constants';

const Container = styled.View`
  width: 100%;
  height: ${SIZE12}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.color || COLORS.WHITE1};
  padding-horizontal: ${SIZE2}px;
`;

const CenterIconWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-horizontal: ${SIZE2}px;
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
