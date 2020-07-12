import moment from 'moment';

import {
  DATE_FORMAT,
  JOB_TYPE,
} from 'src/constants';

function delay(milliseconds) {
  return new Promise((rs) => setTimeout(rs, milliseconds));
}

function getFormattedDate(date) {
  return moment(date).format(DATE_FORMAT);
};

function getStartOfMonth(date, format = DATE_FORMAT) {
  return moment(date, format)
    .startOf('month').format('YYYY-MM-DD');
};

function getEndOfMonth(date, format = DATE_FORMAT) {
  return moment(date, format)
    .endOf('month').format('YYYY-MM-DD');
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
  getFormattedDate,
  getStartOfMonth,
  getEndOfMonth,
  getJobCustomerAddress,
};
