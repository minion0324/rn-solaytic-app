import { createSelector } from 'reselect';

const getJobsStore = state => state.Jobs;

const getAllJobs = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.allJobs || [];
  },
);

const getCountOfJobs = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.countOfJobs || 0;
  },
);

const getPageOfJobs = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.pageOfJobs || 1;
  },
);

const getAllAlerts = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.allAlerts || [];
  },
);

const getCountOfAlerts = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.countOfAlerts || 0;
  },
);

const getPageOfAlerts = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.pageOfAlerts || 1;
  },
);

const getFocusedJob = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.focusedJob || {};
  },
);

export default {
  getAllJobs,
  getCountOfJobs,
  getPageOfJobs,
  getAllAlerts,
  getCountOfAlerts,
  getPageOfAlerts,
  getFocusedJob,
};
