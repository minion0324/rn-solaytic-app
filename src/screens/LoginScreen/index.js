import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const LoginScreen = ({ componentId }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
    </View>
  );
};

LoginScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default LoginScreen;
