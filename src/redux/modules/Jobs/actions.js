import { createAction } from 'redux-actions';

export const GET_JOBS_SUCCESS = 'JOBS/GET_JOBS_SUCCESS';
export const GET_JOBS_BY_DATE = 'JOBS/GET_JOBS_BY_DATE';
export const GET_JOBS_BY_DATE_SUCCESS = 'JOBS/GET_JOBS_BY_DATE_SUCCESS';
export const GET_JOBS_BY_PAGE = 'JOBS/GET_JOBS_BY_PAGE';
export const GET_JOBS_BY_PAGE_SUCCESS = 'JOBS/GET_JOBS_BY_PAGE_SUCCESS';
export const GET_ALERTS_SUCCESS = 'JOBS/GET_ALERTS_SUCCESS';
export const GET_ALERTS_BY_DATE = 'JOBS/GET_ALERTS_BY_DATE';
export const GET_ALERTS_BY_DATE_SUCCESS = 'JOBS/GET_ALERTS_BY_DATE_SUCCESS';
export const GET_ALERTS_BY_PAGE = 'JOBS/GET_ALERTS_BY_PAGE';
export const GET_ALERTS_BY_PAGE_SUCCESS = 'JOBS/GET_ALERTS_BY_PAGE_SUCCESS';
export const RELOAD_JOBS_AND_ALERTS = 'JOBS/RELOAD_JOBS_AND_ALERTS';
export const RELOAD_JOBS_AND_ALERTS_SUCCESS = 'JOBS/RELOAD_JOBS_AND_ALERTS_SUCCESS';
export const ACKNOWLEDGE_JOBS = 'JOBS/ACKNOWLEDGE_JOBS';
export const ACKNOWLEDGE_JOBS_SUCCESS = 'JOBS/ACKNOWLEDGE_JOBS_SUCCESS';
export const START_JOBS = 'JOBS/START_JOBS';
export const START_JOBS_SUCCESS = 'JOBS/START_JOBS_SUCCESS';
export const PULL_JOBS = 'JOBS/PULL_JOBS';
export const PULL_JOBS_SUCCESS = 'JOBS/PULL_JOBS_SUCCESS';
export const SHIFT_JOBS = 'JOBS/SHIFT_JOBS';
export const SHIFT_JOBS_SUCCESS = 'JOBS/SHIFT_JOBS_SUCCESS';
export const EXCHANGE_JOBS = 'JOBS/EXCHANGE_JOBS';
export const EXCHANGE_JOBS_SUCCESS = 'JOBS/EXCHANGE_JOBS_SUCCESS';
export const COMPLETE_JOBS = 'JOBS/COMPLETE_JOBS';
export const COMPLETE_JOBS_SUCCESS = 'JOBS/COMPLETE_JOBS_SUCCESS';
export const FAIL_JOBS = 'JOBS/FAIL_JOBS';
export const FAIL_JOBS_SUCCESS = 'JOBS/FAIL_JOBS_SUCCESS';
export const GET_JOB_BY_ID = 'JOBS/GET_JOB_BY_ID';
export const GET_JOB_BY_ID_SUCCESS = 'JOBS/GET_JOB_BY_ID_SUCCESS';
export const MARK_MESSAGES_AS_READ = 'JOBS/MARK_MESSAGES_AS_READ';
export const MARK_MESSAGES_AS_READ_SUCCESS = 'JOBS/MARK_MESSAGES_AS_READ_SUCCESS';
export const ADD_MESSAGE = 'JOBS/ADD_MESSAGE';
export const ADD_MESSAGE_SUCCESS = 'JOBS/ADD_MESSAGE_SUCCESS';
export const UPDATE_DATE_FOR_JOBS = 'JOBS/UPDATE_DATE_FOR_JOBS';

export const actionCreators = {
  getJobsSuccess: createAction(GET_JOBS_SUCCESS),
  getJobsByDate: createAction(GET_JOBS_BY_DATE),
  getJobsByDateSuccess: createAction(GET_JOBS_BY_DATE_SUCCESS),
  getJobsByPage: createAction(GET_JOBS_BY_PAGE),
  getJobsByPageSuccess: createAction(GET_JOBS_BY_PAGE_SUCCESS),
  getAlertsSuccess: createAction(GET_ALERTS_SUCCESS),
  getAlertsByDate: createAction(GET_ALERTS_BY_DATE),
  getAlertsByDateSuccess: createAction(GET_ALERTS_BY_DATE_SUCCESS),
  getAlertsByPage: createAction(GET_ALERTS_BY_PAGE),
  getAlertsByPageSuccess: createAction(GET_ALERTS_BY_PAGE_SUCCESS),
  reloadJobsAndAlerts: createAction(RELOAD_JOBS_AND_ALERTS),
  reloadJobsAndAlertsSuccess: createAction(RELOAD_JOBS_AND_ALERTS_SUCCESS),
  acknowledgeJobs: createAction(ACKNOWLEDGE_JOBS),
  acknowledgeJobsSuccess: createAction(ACKNOWLEDGE_JOBS_SUCCESS),
  startJobs: createAction(START_JOBS),
  startJobsSuccess: createAction(START_JOBS_SUCCESS),
  pullJobs: createAction(PULL_JOBS),
  pullJobsSuccess: createAction(PULL_JOBS_SUCCESS),
  shiftJobs: createAction(SHIFT_JOBS),
  shiftJobsSuccess: createAction(SHIFT_JOBS_SUCCESS),
  exchangeJobs: createAction(EXCHANGE_JOBS),
  exchangeJobsSuccess: createAction(EXCHANGE_JOBS_SUCCESS),
  completeJobs: createAction(COMPLETE_JOBS),
  completeJobsSuccess: createAction(COMPLETE_JOBS_SUCCESS),
  failJobs: createAction(FAIL_JOBS),
  failJobsSuccess: createAction(FAIL_JOBS_SUCCESS),
  getJobById: createAction(GET_JOB_BY_ID),
  getJobByIdSuccess: createAction(GET_JOB_BY_ID_SUCCESS),
  markMessagesAsRead: createAction(MARK_MESSAGES_AS_READ),
  markMessagesAsReadSuccess: createAction(MARK_MESSAGES_AS_READ_SUCCESS),
  addMessage: createAction(ADD_MESSAGE),
  addMessageSuccess: createAction(ADD_MESSAGE_SUCCESS),
  updateDateForJobs: createAction(UPDATE_DATE_FOR_JOBS),
};
