import { createSelector } from 'reselect';

const getUserStore = state => state.User;

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

const getRememberedUser = createSelector(
  getUserStore,
  (user) => {
    return user.rememberedUser || '';
  },
);

export default {
  getIsRehydrated,
  getToken,
  getRememberedUser,
};
