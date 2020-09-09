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

export default {
  getCoreScreenInfo,
  getDriverNotes,
  getCountOfDriverNotes,
  getPageOfDriverNotes,
  getIsRequiredUpdateTab,
  getIsNetworkConnected,
  getNewCommentInfo,
};
