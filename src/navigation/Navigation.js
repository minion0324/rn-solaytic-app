import { Navigation } from 'react-native-navigation';

import {
  IMAGES,
  COLORS,
  WIDTH,
  FONT,
} from 'src/constants';

import {
  LOGIN_SCREEN,
  ALERT_SCREEN,
  JOBS_SCREEN,
  DRAWER_SCREEN,
} from './Screens';

import registerScreens from './registerScreens';

registerScreens();

export const DRAWER_COMPONENT_ID = 'left.NavigationDrawer';

export function showDrawer(componentId) {
  Navigation.mergeOptions(componentId, {
    sideMenu: {
      left: {
        visible: true,
      },
    },
  });
}

export function dismissDrawer(componentId) {
  Navigation.mergeOptions(componentId, {
    sideMenu: {
      left: {
        visible: false,
      },
    },
  });
}

export function showOverlay(screenName, passProps = {}, options = {}) {
  return Navigation.showOverlay({
    component: {
      name: screenName,
      passProps: {
        ...passProps,
      },
      options: {
        layout: {
          componentBackgroundColor: COLORS.TRANSPARENT1,
        },
        overlay: {
          interceptTouchOutside: true,
        },
        ...options,
      },
    },
  });
}

export function dismissOverlay(componentId) {
  return Navigation.dismissOverlay(componentId);
}

export function changeTabIndex(componentId, tabIndex) {
  Navigation.mergeOptions(componentId, {
    bottomTabs: {
      currentTabIndex: tabIndex,
    },
  });
}

export function showModal(modalName, passProps = {}, options = {}) {
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: modalName,
          passProps: {
            ...passProps,
          },
          options: {
            ...options,
          },
        },
      }],
    },
  });
}

export function dismissModal(componentId) {
  return Navigation.dismissModal(componentId);
}

export function pushScreen(componentId, screenName, passProps = {}, options = {}) {
  return Navigation.push(componentId, {
    component: {
      name: screenName,
      passProps: {
        ...passProps,
      },
      options: {
        sideMenu: {
          left: {
            enabled: false,
          },
        },
        ...options,
      },
    },
  });
}

export function popScreen(componentId) {
  return Navigation.pop(componentId);
}

export function popToRootScreen(componentId) {
  return Navigation.popToRoot(componentId);
}

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
      visible: false,
      drawBehind: true,
      animate: false,
      currentTabIndex: 1,
    },
    bottomTab: {
      fontSize: FONT(13),
      textColor: COLORS.GRAY1,
      selectedTextColor: COLORS.BLUE1,
      iconInsets: { top: 10, bottom: 5 },
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
      visible: false,
      drawBehind: true,
      animate: false,
      currentTabIndex: 1,
    },
    bottomTab: {
      fontSize: FONT(13),
      textColor: COLORS.GRAY1,
      selectedTextColor: COLORS.BLUE1,
      iconInsets: { top: 10, bottom: 5 },
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
            ],
          },
        },
        id: 'sideMenu',
        left: {
          component: {
            id: DRAWER_COMPONENT_ID,
            name: DRAWER_SCREEN,
            passProps: {
              componentId: DRAWER_COMPONENT_ID,
            },
          },
        },
        options: {
          sideMenu: {
            left: {
              width: WIDTH * 0.6,
            },
          },
        },
      },
    },
  });
}
