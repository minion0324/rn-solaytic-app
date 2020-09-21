import {
  Platform,
  Dimensions,
} from 'react-native';

//
const PLATFORM = Platform.OS;

//
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

//
const SIZE1 = WIDTH * 0.014; // 5
const SIZE2 = SIZE1 * 2; // 10
const SIZE3 = SIZE1 * 3; // 15
const SIZE4 = SIZE1 * 4; // 20
const SIZE5 = SIZE1 * 5; // 25

const SIZE6 = SIZE1 * 6; // 30
const SIZE8 = SIZE1 * 8; // 40
const SIZE10 = SIZE1 * 10; // 50
const SIZE12 = SIZE1 * 12; // 60
const SIZE14 = SIZE1 * 14; // 70
const SIZE16 = SIZE1 * 16; // 80

const SIZE20 = SIZE1 * 20; // 100
const SIZE22 = SIZE1 * 22; // 110
const SIZE24 = SIZE1 * 24; // 120
const SIZE30 = SIZE1 * 30; // 150
const SIZE40 = SIZE1 * 40; // 200

//
const scale = size => WIDTH / 360 * size; // 360
const FONT = (size, factor = 0.5) => (size + (scale(size) - size) * factor);

//
const APP_DATE_FORMAT = 'DD MMM YYYY';
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

const DATE_KEY = 'date';
const MONTH_KEY = 'month';

//
const JOB_DATE = 'jobTimeSpecific';

const JOB_STATUS = {
  UNASSIGNED: 'Unassigned',
  ASSIGNED: 'Assigned',
  DISPATCHED: 'Dispatched',
  ACKNOWLEDGED: 'Acknowledged',
  IN_PROGRESS1: 'In Progress',
  IN_PROGRESS2: 'In Progress(1/2)',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',

  FOR_ACKNOWLEDGE: ['Unassigned', 'Assigned', 'Dispatched'],
};

const JOB_TYPE = {
  PULL: 'Pull',
  PUT: 'Put',
  EXCHANGE: 'Exchange',
  ON_THE_SPOT: 'OnTheSpot',
  OUT: 'Out',
  SHIFT: 'Shift',
  THROW_AT_CUSTOMER: 'ThrowAtCustomer',
};

//
const COMPLETE_JOBS_KEY = '@complete_jobs';
const BACKGROUND_FETCH_KEY = '@background_fetch';
const JOB_DETAILS_KEY = '@job_details';

const JOB_DETAILS_LIMIT = 20;

//
const API_BASE_URL =
  'https://staging-tms-dispatch.logisfleet.com/';
  // 'https://tms-dispatch-api.wasteporter.com/';

export {
  PLATFORM,
  WIDTH,
  HEIGHT,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE5,
  SIZE6,
  SIZE8,
  SIZE10,
  SIZE12,
  SIZE14,
  SIZE16,
  SIZE20,
  SIZE22,
  SIZE24,
  SIZE30,
  SIZE40,
  FONT,
  APP_DATE_FORMAT,
  DEFAULT_DATE_FORMAT,
  DATE_KEY,
  MONTH_KEY,
  JOB_DATE,
  JOB_STATUS,
  JOB_TYPE,
  COMPLETE_JOBS_KEY,
  BACKGROUND_FETCH_KEY,
  JOB_DETAILS_KEY,
  JOB_DETAILS_LIMIT,
  API_BASE_URL,
};
