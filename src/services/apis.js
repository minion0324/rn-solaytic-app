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

function apiAuthToken() {
  return apiCall('api/mobile/driver/authenticate-token', 'post', {});
};

function apiSetFCMToken(deviceToken) {
  return apiCall('api/mobile/driver/authenticate-token', 'post', {
    data: {
      deviceToken,
    },
  });
}

function apiGetJobs(
  fromDate,
  toDate,
  isAssigned,
  currentPage = 1,
  pageSize = 10,
  sortColumn = 'JobDate',
  sortDir = 'asc',
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
};

function apiAcknowledgeJobs(jobIds) {
  return apiCall('api/mobile/driver/jobs/acknowledge', 'post', {
    data: {
      jobIds,
    },
  });
};

function apiStartJobs(jobIds) {
  return apiCall('api/mobile/driver/jobs/start', 'post', {
    data: {
      jobIds,
    },
  });
};

function apiExchangeJobs(jobIds) {
  return apiCall('api/mobile/driver/jobs/exchange', 'post', {
    data: {
      jobIds,
    },
  });
};

function apiCompleteJobs(jobIds) {
  return apiCall('api/mobile/driver/jobs/Complete', 'post', {
    data: {
      jobIds,
    },
  });
};

export {
  apiLogin,
  apiAuthToken,
  apiSetFCMToken,
  apiGetJobs,
  apiAcknowledgeJobs,
  apiStartJobs,
  apiExchangeJobs,
  apiCompleteJobs,
};
