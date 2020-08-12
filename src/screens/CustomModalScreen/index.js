import React from 'react';
import PropTypes from 'prop-types';

import {
  dismissOverlay,
} from 'src/navigation';
import {
  OverlayWrap,
} from 'src/components';

const CustomModalScreen = ({
  width,
  top,
  getContent,
  componentId,
}) => {

  const onBack = () => {
    dismissOverlay(componentId);
  };

  return (
    <OverlayWrap width={width} top={top} dismissOverlay={onBack}>
      {getContent(componentId)}
    </OverlayWrap>
  );
};

CustomModalScreen.propTypes = {
  width: PropTypes.string.isRequired,
  top: PropTypes.number.isRequired,
  getContent: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

CustomModalScreen.defaultProps = {
  //
};

export default CustomModalScreen;
