import { createSelector } from 'reselect';

const getJobsStore = state => state.Jobs;

const getAllJobs = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.jobs || [];
  },
);

const getCountOfJobs = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.count || 0;
  },
);

const getPageIndex = createSelector(
  getJobsStore,
  (jobs) => {
    return jobs.pageIndex || 1;
  },
);

export default {
  getAllJobs,
  getCountOfJobs,
  getPageIndex,
};
