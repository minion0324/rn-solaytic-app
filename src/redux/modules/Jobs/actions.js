import { createAction } from 'redux-actions';

export const GET_JOBS = 'JOBS/GET_JOBS';
export const GET_JOBS_SUCCESS = 'JOBS/GET_JOBS_SUCCESS';
export const GET_JOBS_BY_DATE = 'JOBS/GET_JOBS_BY_DATE';
export const GET_JOBS_BY_DATE_SUCCESS = 'JOBS/GET_JOBS_BY_DATE_SUCCESS';

export const actionCreators = {
  getJobs: createAction(GET_JOBS),
  getJobsSuccess: createAction(GET_JOBS_SUCCESS),
  getJobsByDate: createAction(GET_JOBS_BY_DATE),
  getJobsByDateSuccess: createAction(GET_JOBS_BY_DATE_SUCCESS),
};
