import {
  COLORS,
  COMMON_SIZE,
  COMMON_PADDING,
  FONT,
} from 'src/constants';

const TAB_WIDTH = COMMON_SIZE * 1.2;
const INDICATOR_WIDTH = COMMON_SIZE * 0.7;

const TabBarStyle = {
  height: COMMON_SIZE * 0.4,
  paddingTop: 0,
  backgroundColor: COLORS.BLUE1,
  elevation: 0,
};

const TabBarIndicatorStyle = {
  width: INDICATOR_WIDTH,
  height: 3,
  left: (TAB_WIDTH - INDICATOR_WIDTH) / 2,
  backgroundColor: COLORS.WHITE1,
};

const TabBarLabelStyle = {
  fontSize: FONT(12),
};

const TabBarTabStyle = {
  width: TAB_WIDTH,
};

const TabBarTabFullWidthStyle = {
  //
};

const TabBarActiveColor = COLORS.WHITE1;

const TabBarInactiveColor = COLORS.WHITE1;

export {
  TabBarStyle,
  TabBarIndicatorStyle,
  TabBarLabelStyle,
  TabBarTabStyle,
  TabBarTabFullWidthStyle,
  TabBarActiveColor,
  TabBarInactiveColor,
};
