import moment from 'moment';

import {
  DATE_FORMAT,
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

export {
  delay,
  getFormattedDate,
  getStartOfMonth,
  getEndOfMonth,
};
