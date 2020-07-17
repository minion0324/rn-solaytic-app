import { createAction } from 'redux-actions';

export const SET_CORE_SCREEN_INFO = 'VIEW/SET_CORE_SCREEN_INFO';
export const UPLOAD_PHOTOS = 'VIEW/UPLOAD_PHOTOS';
export const UPLOAD_PHOTOS_SUCCESS = 'VIEW/UPLOAD_PHOTOS_SUCCESS';
export const UPLOAD_SIGN = 'VIEW/UPLOAD_SIGN';
export const UPLOAD_SIGN_SUCCESS = 'VIEW/UPLOAD_SIGN_SUCCESS';
export const INIT_JOB_PHOTOS_AND_SIGN = 'VIEW/INIT_JOB_PHOTOS_AND_SIGN';


export const actionCreators = {
  setCoreScreenInfo: createAction(SET_CORE_SCREEN_INFO),
  uploadPhotos: createAction(UPLOAD_PHOTOS),
  uploadPhotosSuccess: createAction(UPLOAD_PHOTOS_SUCCESS),
  uploadSign: createAction(UPLOAD_SIGN),
  uploadSignSuccess: createAction(UPLOAD_SIGN_SUCCESS),
  initJobPhotosAndSign: createAction(INIT_JOB_PHOTOS_AND_SIGN),
};
