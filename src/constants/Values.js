import {
  Platform,
  Dimensions,
} from 'react-native';

//
const PLATFORM = Platform.OS;

//
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

//
const COMMON_HEIGHT1 = HEIGHT * 0.156;
const COMMON_PADDING1 = WIDTH * 0.028;

export {
  PLATFORM,
  WIDTH,
  HEIGHT,
  COMMON_HEIGHT1,
  COMMON_PADDING1,
};
