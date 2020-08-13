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
  dismissible,
  getContent,
  componentId,
}) => {

  const onBack = () => {
    dismissOverlay(componentId);
  };

  return (
    <OverlayWrap
      width={width}
      top={top}
      dismissible={dismissible}
      dismissOverlay={onBack}
    >
      {getContent(componentId)}
    </OverlayWrap>
  );
};

CustomModalScreen.propTypes = {
  width: PropTypes.string,
  top: PropTypes.number,
  dismissible: PropTypes.bool,
  getContent: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

CustomModalScreen.defaultProps = {
  width: '90%',
  top: 0,
  dismissible: true,
};

export default CustomModalScreen;
