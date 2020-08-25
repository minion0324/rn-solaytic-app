import { createSelector } from 'reselect';

const getUserStore = state => state.User;

const getUserInfo = createSelector(
  getUserStore,
  (user) => {
    return user.userInfo || {};
  },
);

const getIsRehydrated = createSelector(
  getUserStore,
  (user) => {
    return user.isRehydrated || false;
  },
);

const getToken = createSelector(
  getUserStore,
  (user) => {
    return user.token || '';
  },
);

const getAppLogo = createSelector(
  getUserStore,
  (user) => {
    return user.appLogo || '';
  },
);

const getRememberedUser = createSelector(
  getUserStore,
  (user) => {
    return user.rememberedUser || '';
  },
);

const getDriverName = createSelector(
  getUserInfo,
  (userInfo) => {
    return userInfo.driverName || '';
  },
);

export default {
  getIsRehydrated,
  getToken,
  getAppLogo,
  getRememberedUser,
  getDriverName,
};
