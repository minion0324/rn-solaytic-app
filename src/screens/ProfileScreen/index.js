import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const ProfileScreen = ({ componentId }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
};

ProfileScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default ProfileScreen;
