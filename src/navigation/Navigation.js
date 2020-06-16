import { Navigation } from 'react-native-navigation';

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
      textColor: '#707070',
      selectedTextColor: '#03A9F4',
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
                      icon: require('src/assets/images/first-tab.png'),
                      selectedIcon: require('src/assets/images/first-tab-active.png'),
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
                      icon: require('src/assets/images/second-tab.png'),
                      selectedIcon: require('src/assets/images/second-tab-active.png'),
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
                      icon: require('src/assets/images/third-tab.png'),
                      selectedIcon: require('src/assets/images/third-tab-active.png'),
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
