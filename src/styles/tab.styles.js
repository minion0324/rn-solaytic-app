import {
  COLORS,
  SIZE8,
  SIZE12,
  SIZE20,
  SIZE24,
  FONT,
} from 'src/constants';

const TAB_WIDTH = SIZE24;
const INDICATOR_WIDTH = SIZE12;

const TabBarStyle = {
  height: SIZE8,
  paddingTop: 0,
  backgroundColor: COLORS.BLUE1,
  elevation: 0,

  shadowColor: COLORS.BLACK1,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 4,
  shadowOpacity: 0.1,
};

const TabBarIndicatorStyle = {
  width: INDICATOR_WIDTH,
  height: 3,
  left: (TAB_WIDTH - INDICATOR_WIDTH) / 2,
  backgroundColor: COLORS.WHITE1,
};

const TabBarLabelStyle = {
  fontSize: FONT(14),
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
