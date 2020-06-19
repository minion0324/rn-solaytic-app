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
const SIZE16 = SIZE1 * 16; // 80

const SIZE20 = SIZE1 * 20; // 100
const SIZE24 = SIZE1 * 24; // 120
const SIZE40 = SIZE1 * 40; // 200


//
const scale = size => WIDTH / 360 * size; // 360
const FONT = (size, factor = 0.5) => (size + (scale(size) - size) * factor);

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
  SIZE16,
  SIZE20,
  SIZE24,
  SIZE40,
  FONT,
};
