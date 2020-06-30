import {
  apiCall,
} from './apiInstance';

function apiLogin(userName, password) {
  return apiCall('api/mobile/driver/login', 'post', {
    data: {
      userName,
      password,
    },
  });
};

function apiAuthToken(token) {
  return apiCall('api/mobile/driver/authenticate-token', 'post', {});
}

function apiGetJobs(
  fromDate,
  toDate,
  isAssigned,
  currentPage = 1,
  pageSize = 10,
  sortColumn = 'JobDate',
  sortDir = 'desc',
  jobTypeFilter = '',
  jobStatusFilter = '',
) {
  return apiCall('api/mobile/driver/jobs', 'get', {
    params: {
      fromDate,
      toDate,
      isAssigned,
      currentPage,
      pageSize,
      sortColumn,
      sortDir,
      jobTypeFilter,
      jobStatusFilter,
    },
  });
}

export {
  apiLogin,
  apiAuthToken,
  apiGetJobs,
};
