import { createSelector } from 'reselect';

const getViewStore = state => state.View;

const getCoreScreenInfo = createSelector(
  getViewStore,
  (view) => {
    return view.coreScreenInfo || {};
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

const getIsRequiredUpdateTab = createSelector(
  getViewStore,
  (view) => {
    return view.isRequiredUpdateTab || false;
  },
);

const getIsNetworkConnected = createSelector(
  getViewStore,
  (view) => {
    return view.isNetworkConnected;
  },
);

const getNewCommentInfo = createSelector(
  getViewStore,
  (view) => {
    return view.newCommentInfo || {};
  },
);

const getBinNumbers = createSelector(
  getViewStore,
  (view) => {
    return view.binNumbers || [];
  },
);

const getJobDates = createSelector(
  getViewStore,
  (view) => {
    return view.jobDates || [];
  },
);

const getWasteTypes = createSelector(
  getViewStore,
  (view) => {
    return view.wasteTypes || [];
  },
);

const getCountOfWasteTypes = createSelector(
  getWasteTypes,
  (wasteTypes) => {
    return wasteTypes.length;
  },
);

const getPageOfWasteTypes = createSelector(
  getCountOfWasteTypes,
  (countOfWasteTypes) => {
    return Math.floor(countOfWasteTypes / 10 + 1);
  },
);

export default {
  getCoreScreenInfo,
  getDriverNotes,
  getCountOfDriverNotes,
  getPageOfDriverNotes,
  getIsRequiredUpdateTab,
  getIsNetworkConnected,
  getNewCommentInfo,
  getBinNumbers,
  getJobDates,
  getWasteTypes,
  getCountOfWasteTypes,
  getPageOfWasteTypes,
};
