import { createSelector } from 'reselect';

const getUserStore = state => state.User;

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
  getToken,
  getRememberedUser,
}