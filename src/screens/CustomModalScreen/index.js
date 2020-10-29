import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  dismissLightBox,
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
  const [ modalData, setModalData ] = useState(null);

  const onBack = () => {
    dismissLightBox(componentId);
  };

  return (
    <OverlayWrap
      width={width}
      offsetFromCenter={offsetFromCenter}
      dismissible={dismissible}
      dismissOverlay={onBack}
    >
      {
        getContent(componentId, { modalData, setModalData })
      }
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
