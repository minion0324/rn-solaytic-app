import {
  Platform,
  Dimensions,
} from 'react-native';

//
const PLATFORM = Platform.OS;

//
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

//
const SIZE0 = WIDTH * 0.006; // 2
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
  STARTED: 'Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',

  FOR_ACKNOWLEDGE: ['Unassigned', 'Assigned', 'Dispatched'],
};

const JOB_TYPE = {
  PULL: 'Pull',
  PUT: 'Put',
  EXCHANGE: 'Exchange',
  ON_THE_SPOT: 'On The Spot',
  OUT: 'Out',
  SHIFT: 'Shift',
  THROW_AT_CUSTOMER: 'ThrowAtCustomer',
};

//
const COMPLETE_JOBS_KEY = '@complete_jobs';
const BACKGROUND_FETCH_KEY = '@background_fetch';
const JOB_DETAILS_KEY = '@job_details';

const JOB_DETAILS_LIMIT = 20;

const SIGNATURE_WRAP_RATIO = 1.2;

const IMAGE_COMPRESS_QUALITY = 50;
const MAX_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 800;

//
const API_BASE_URL =
  // 'https://staging-tms-dispatch.logisfleet.com/';
  'https://tms-dispatch-api.wasteporter.com/';

export {
  PLATFORM,
  WIDTH,
  HEIGHT,
  SIZE0,
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
  SIGNATURE_WRAP_RATIO,
  API_BASE_URL,
  IMAGE_COMPRESS_QUALITY,
  MAX_IMAGE_WIDTH,
  MAX_IMAGE_HEIGHT,
};
