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

const getCountOfDriverNotes = createSelector(
  getDriverNotes,
  (driverNotes) => {
    return driverNotes.length;
  },
);

const getPageOfDriverNotes = createSelector(
  getCountOfDriverNotes,
  (countOfDriverNotes) => {
    return Math.floor(countOfDriverNotes / 10 + 1);
  },
);

export default {
  getCoreScreenInfo,
  getJobPhotos,
  getJobSign,
  getDriverNotes,
  getCountOfDriverNotes,
  getPageOfDriverNotes,
};
