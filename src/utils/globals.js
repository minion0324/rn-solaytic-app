import moment from 'moment';

import {
  APP_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
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

export {
  delay,
  getDate,
  getStartDate,
  getEndDate,
};
