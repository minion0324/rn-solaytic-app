import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const JobsScreen = ({ componentId }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Jobs Screen</Text>
    </View>
  );
};

JobsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default JobsScreen;
