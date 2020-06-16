import { Navigation } from 'react-native-navigation';

import {
  IMAGES,
  COLORS,
} from 'src/constants';

import {
  LOGIN_SCREEN,
  ALERT_SCREEN,
  JOBS_SCREEN,
  PROFILE_SCREEN,
} from './Screens';

import registerScreens from './registerScreens';

registerScreens();

export function pushSingleScreenApp() {
  Navigation.setDefaultOptions({
    layout: {
      orientation: ['portrait'],
    },
    topBar: {
      visible: false,
      drawBehind: true,
      animate: false,
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
    },
    bottomTab: {
      textColor: COLORS.GRAY1,
      selectedTextColor: COLORS.BLUE1,
      iconInsets: { top: 5 },
    },
    popGesture: false,
  });

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: LOGIN_SCREEN,
            },
          },
        ],
      },
    },
  });
}

export function pushMultiScreensApp() {
  Navigation.setDefaultOptions({
    layout: {
      orientation: ['portrait'],
    },
    topBar: {
      visible: false,
      drawBehind: true,
      animate: false,
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
    },
    bottomTab: {
      textColor: '#707070',
      selectedTextColor: '#03A9F4',
      iconInsets: { top: 5 },
    },
    popGesture: false,
  });

  Navigation.setRoot({
    root: {
      sideMenu: {
        center: {
          bottomTabs: {
            children: [
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: ALERT_SCREEN,
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'Alert',
                      icon: IMAGES.FIRST_TAB,
                      selectedIcon: IMAGES.FIRST_TAB_ACTIVE,
                      testID: 'FIRST_TAB_BAR_BUTTON',
                    },
                  },
                },
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: JOBS_SCREEN,
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'Jobs',
                      icon: IMAGES.SECOND_TAB,
                      selectedIcon: IMAGES.SECOND_TAB_ACTIVE,
                      testID: 'SECOND_TAB_BAR_BUTTON',
                    },
                  },
                },
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: PROFILE_SCREEN,
                      },
                    },
                  ],
                  options: {
                    bottomTab: {
                      text: 'Profile',
                      icon: IMAGES.THIRD_TAB,
                      selectedIcon: IMAGES.THIRD_TAB_ACTIVE,
                      testID: 'THIRD_TAB_BAR_BUTTON',
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  });
}
