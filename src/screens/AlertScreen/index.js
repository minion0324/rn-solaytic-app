import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const AlertScreen = ({ componentId }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Alert Screen</Text>
    </View>
  );
};

AlertScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default AlertScreen;
