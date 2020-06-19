import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import createStore from '../store';

let store;

const AppProvider = ({ children }) => {
  store = store || createStore();

  return (
    <Provider store={store}>{children}</Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
