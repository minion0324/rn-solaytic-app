import { createSelector } from 'reselect';

const getViewStore = state => state.View;

const getCurrentScreenInfo = createSelector(
  getViewStore,
  (view) => {
    return view.currentScreenInfo || {};
  },
);

export default {
  getCurrentScreenInfo,
};
