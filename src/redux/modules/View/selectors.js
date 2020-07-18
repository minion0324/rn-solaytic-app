import { createSelector } from 'reselect';

const getViewStore = state => state.View;

const getCoreScreenInfo = createSelector(
  getViewStore,
  (view) => {
    return view.coreScreenInfo || {};
  },
);

const getJobPhotos = createSelector(
  getViewStore,
  (view) => {
    return view.jobPhotos || [];
  },
);

const getJobSign = createSelector(
  getViewStore,
  (view) => {
    return view.jobSign || '';
  },
);

const getDriverNotes = createSelector(
  getViewStore,
  (view) => {
    return view.driverNotes || [];
  },
);

export default {
  getCoreScreenInfo,
  getJobPhotos,
  getJobSign,
  getDriverNotes,
};
