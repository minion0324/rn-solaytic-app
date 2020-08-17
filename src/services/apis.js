import {
  JOB_DATE,
} from 'src/constants';

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
  return apiCall('api/mobile/driver/authenticate-token', 'post', {
    data: {},
  });
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
  sortColumn = JOB_DATE[0],
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

function apiStartJobs(jobIds, stepBinUpdate) {
  return apiCall('api/mobile/driver/jobs/start', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
    },
  });
};

function apiExchangeJobs(jobIds, stepBinUpdate) {
  return apiCall('api/mobile/driver/jobs/exchange', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
    },
  });
};

function apiCompleteJobs(jobIds, stepBinUpdate, attempt) {
  return apiCall('api/mobile/driver/jobs/Complete', 'post', {
    data: {
      jobIds,
      stepBinUpdate,
      attempt,
    },
  });
};

function apiGetDriverNotes(
  searchQuery = '',
  currentPage = 1,
  pageSize = 10,
  sortColumn = '', // 'driverNoteId',
  sortDir = 'asc',
) {
  return apiCall('api/mobile/driver/notes', 'get', {
    params: {
      searchQuery,
      currentPage,
      pageSize,
      sortColumn,
      sortDir,
    },
  });
};

function apiFailJobs(jobIds, attempt) {
  return apiCall('api/mobile/driver/jobs/fail', 'post', {
    data: {
      jobIds,
      attempt,
    },
  });
};

function apiGetJobById(jobId) {
  return apiCall(`api/mobile/driver/jobs/${jobId}`, 'get', {});
};

function apiAddService(jobId, serviceId) {
  return apiCall('api/mobile/driver/jobs/add-additional-service', 'post', {
    data: {
      jobId,
      serviceAdditionalChargeTemplateId: serviceId,
    },
  });
};

function apiRemoveService(jobId, serviceId) {
  return apiCall('api/mobile/driver/jobs/remove-additional-service', 'post', {
    data: {
      jobId,
      serviceAdditionalChargeTemplateId: serviceId,
    },
  });
};

function apiMarkMessagesAsRead(jobId) {
  return apiCall('api/mobile/driver/jobs/mark-messages-as-read', 'post', {
    data: {
      jobId,
    },
  });
};

function apiAddMessage(jobId, message) {
  return apiCall('api/mobile/driver/jobs/add-message', 'post', {
    data: {
      jobId,
      message,
    },
  });
};

function apiUpdateAmountCollected(jobIds, attempt) {
  return apiCall('api/mobile/driver/jobs/update-amount-collected', 'post', {
    data: {
      jobIds,
      attempt,
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
  apiGetDriverNotes,
  apiFailJobs,
  apiGetJobById,
  apiAddService,
  apiRemoveService,
  apiMarkMessagesAsRead,
  apiAddMessage,
  apiUpdateAmountCollected,
};
