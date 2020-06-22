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

export {
  apiLogin,
};
