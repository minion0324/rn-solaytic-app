import { createAction } from 'redux-actions';

export const SET_CORE_SCREEN_INFO = 'VIEW/SET_CORE_SCREEN_INFO';
export const GET_DRIVER_NOTES = 'VIEW/GET_DRIVER_NOTES';
export const GET_DRIVER_NOTES_SUCCESS = 'VIEW/GET_DRIVER_NOTES_SUCCESS';
export const GET_DRIVER_NOTES_BY_PAGE = 'VIEW/GET_DRIVER_NOTES_BY_PAGE';
export const GET_DRIVER_NOTES_BY_PAGE_SUCCESS = 'VIEW/GET_DRIVER_NOTES_BY_PAGE_SUCCESS';
export const SET_IS_REQUIRED_UPDATE_TAB = 'VIEW/SET_IS_REQUIRED_UPDATE_TAB';
export const SET_IS_NETWORK_CONNECTED = 'VIEW/SET_IS_NETWORK_CONNECTED';
export const SET_NEW_COMMENT_INFO = 'VIEW/SET_NEW_COMMENT_INFO';
export const GET_BIN_NUMBERS = 'VIEW/GET_BIN_NUMBERS';
export const GET_BIN_NUMBERS_SUCCESS = 'VIEW/GET_BIN_NUMBERS_SUCCESS';
export const GET_JOB_DATES = 'VIEW/GET_JOB_DATES';
export const GET_JOB_DATES_SUCCESS = 'VIEW/GET_JOB_DATES_SUCCESS';
export const GET_WASTE_TYPES = 'VIEW/GET_WASTE_TYPES';
export const GET_WASTE_TYPES_SUCCESS = 'VIEW/GET_WASTE_TYPES_SUCCESS';
export const GET_WASTE_TYPES_BY_PAGE = 'VIEW/GET_WASTE_TYPES_BY_PAGE';
export const GET_WASTE_TYPES_BY_PAGE_SUCCESS = 'VIEW/GET_WASTE_TYPES_BY_PAGE_SUCCESS';

export const actionCreators = {
  setCoreScreenInfo: createAction(SET_CORE_SCREEN_INFO),
  getDriverNotes: createAction(GET_DRIVER_NOTES),
  getDriverNotesSuccess: createAction(GET_DRIVER_NOTES_SUCCESS),
  getDriverNotesByPage: createAction(GET_DRIVER_NOTES_BY_PAGE),
  getDriverNotesByPageSuccess: createAction(GET_DRIVER_NOTES_BY_PAGE_SUCCESS),
  setIsRequiredUpdateTab: createAction(SET_IS_REQUIRED_UPDATE_TAB),
  setIsNetworkConnected: createAction(SET_IS_NETWORK_CONNECTED),
  setNewCommentInfo: createAction(SET_NEW_COMMENT_INFO),
  getBinNumbers: createAction(GET_BIN_NUMBERS),
  getBinNumbersSuccess: createAction(GET_BIN_NUMBERS_SUCCESS),
  getJobDates: createAction(GET_JOB_DATES),
  getJobDatesSuccess: createAction(GET_JOB_DATES_SUCCESS),
  getWasteTypes: createAction(GET_WASTE_TYPES),
  getWasteTypesSuccess: createAction(GET_WASTE_TYPES_SUCCESS),
  getWasteTypesByPage: createAction(GET_WASTE_TYPES_BY_PAGE),
  getWasteTypesByPageSuccess: createAction(GET_WASTE_TYPES_BY_PAGE_SUCCESS),
};
