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
  offsetFromCenter,
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
      offsetFromCenter={offsetFromCenter}
      dismissible={dismissible}
      dismissOverlay={onBack}
    >
      {getContent(componentId)}
    </OverlayWrap>
  );
};

CustomModalScreen.propTypes = {
  width: PropTypes.string,
  offsetFromCenter: PropTypes.number,
  dismissible: PropTypes.bool,
  getContent: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

CustomModalScreen.defaultProps = {
  width: '90%',
  offsetFromCenter: 0,
  dismissible: true,
};

export default CustomModalScreen;