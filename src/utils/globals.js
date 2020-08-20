import moment from 'moment';

import {
  APP_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  JOB_TYPE,
} from 'src/constants';

function delay(milliseconds) {
  return new Promise((rs) => setTimeout(rs, milliseconds));
}

function getDate(date) {
  return moment(date).format(APP_DATE_FORMAT);
};

function getStartDate(date, key, format) {
  return moment(date, format || APP_DATE_FORMAT)
    .startOf(key)
    .format(DEFAULT_DATE_FORMAT);
};

function getEndDate(date, key, format) {
  return moment(date, format || APP_DATE_FORMAT)
    .endOf(key)
    .format(DEFAULT_DATE_FORMAT);
};

function getJobCustomerAddress(job) {
  switch (job.jobTypeName) {
    case JOB_TYPE.PULL:
      return job.steps[0].address || job.steps[1].address;

    case JOB_TYPE.PUT:
    case JOB_TYPE.EXCHANGE:
    case JOB_TYPE.ON_THE_SPOT:
      return job.steps[1].address || job.steps[0].address;

    case JOB_TYPE.OUT:
    case JOB_TYPE.SHIFT:
    case JOB_TYPE.THROW_AT_CUSTOMER:
      return job.steps[2].address || job.steps[1].address || job.steps[0].address;

    default:
      return job.steps[2].address || job.steps[1].address || job.steps[0].address;
  };
}

export {
  delay,
  getDate,
  getStartDate,
  getEndDate,
  getJobCustomerAddress,
};
