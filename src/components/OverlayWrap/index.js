import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
} from 'src/constants';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.View`
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  backgroundColor: ${COLORS.TRANSPARENT2};
`;

const Content = styled.View`
  width: ${props => props.width};
  top: ${props => props.top}px;
  background-color: ${COLORS.WHITE2};
  border-radius: ${SIZE1}px;
  overflow: hidden;
`;

const OverlayWrap = ({
  width,
  top,
  children,
  dismissOverlay,
}) => {
  return (
    <Container>
      <TouchableWithoutFeedback onPress={dismissOverlay}>
        <Overlay />
      </TouchableWithoutFeedback>
      <Content width={width} top={top}>
       { children }
      </Content>
    </Container>
  );
}

OverlayWrap.propTypes = {
  width: PropTypes.string,
  top: PropTypes.number,
  children: PropTypes.node.isRequired,
  dismissOverlay: PropTypes.func,
};

OverlayWrap.defaultProps = {
  width: '90%',
  top: 0,
  dismissOverlay: null,
};

export default OverlayWrap;
