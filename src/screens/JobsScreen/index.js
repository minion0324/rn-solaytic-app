import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';

import {
  HeaderBar,
  BottomBar,
  JobCard,
  ListWrap,
  ItemWrap,
  DatePicker,
} from 'src/components';
import {
  showDrawer,
  showOverlay,
  dismissOverlay,
  changeTabIndex,
  pushScreen,
  popToRootScreen,
  JOB_DETAILS_SCREEN,
  CUSTOM_MODAL_SCREEN,
} from 'src/navigation';
import {
  Jobs,
  ViewStore,
} from 'src/redux';
import {
  pushNotifications,
} from 'src/services';
import {
  delay,
} from 'src/utils';
import {
  JOB_STATUS,
} from 'src/constants';

import {
  Container,
  Content,
  ShadowWrap,
  LoadingWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  SideMenu,
  Calendar,
} from 'src/styles/header.styles';

import {
  TabWrap,
  TabItem,
  TabText,
} from './styled';

const tabs = ['All', 'Open', 'Closed'];

const JobsScreen = ({
  allJobs,
  pageOfJobs,
  dateForJobs,
  focusedJobId,
  coreScreenInfo,
  isNetworkConnected,
  getJobsByDate,
  getJobsByPage,
  reloadJobsAndAlerts,
  getJobById,
  updateDateForJobs,
  setCoreScreenInfo,
  setIsNetworkConnected,
  setNewCommentInfo,
  componentId,
}) => {
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

  const [ tabIndex, setTabIndex ] = useState(0);

  useEffect(() => {
    const networkEventListener = NetInfo.addEventListener(({ isConnected }) => {
      if (isNetworkConnected === isConnected) {
        return;
      }

      setIsNetworkConnected(isConnected);
    });

    return () => {
      networkEventListener();
    };
  }, []);

  useEffect(() => {
    setReloading(true);

    getJobsByDate({
      dateForJobs,
      success: () => setReloading(false),
      failure: () => setReloading(false),
    });
  }, [dateForJobs]);

  useEffect(() => {
    pushNotifications.setNotificationHandlerForJobs(onNotification);
  }, [coreScreenInfo]);

  useNavigationComponentDidAppear((event) => {
    const { componentName } = event;

    setCoreScreenInfo({
      componentId,
      componentName,
      componentType: 'tab',
    });
  });

  const onNotification = async (jobId, message) => {
    try {
      if (message) {
        setNewCommentInfo({ jobId, message });
      }

      if (coreScreenInfo.componentType === 'push') {
        if (
          message && +jobId === focusedJobId &&
          coreScreenInfo.componentName === JOB_DETAILS_SCREEN
        ) {
          getJobById({
            jobId,
            success: () => {},
            failure: () => {},
          });

          return;
        }

        popToRootScreen(coreScreenInfo.componentId);
        await delay(100);
      }

      changeTabIndex(componentId, 1);
      await delay(100);

      onReloading(jobId);
    } catch (error) {
      //
    }
  };

  const onReloading = (jobId) => {
    setReloading(true);

    reloadJobsAndAlerts({
      success: () => onJobDetails(jobId),
      failure: () => setReloading(false),
    });
  };

  const onEnd = () => {
    getJobsByPage({
      dateForJobs,
      pageOfJobs,
      success: () => {},
      failure: () => {},
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    getJobsByDate({
      dateForJobs,
      success: () => setRefreshing(false),
      failure: () => setRefreshing(false),
    });
  };

  const onSuccess = async () => {
    pushScreen(componentId, JOB_DETAILS_SCREEN);

    await delay(100);
    setReloading(false);
  };

  const onFailure = () => {
    setReloading(false);
  };

  const onJobDetails = (jobId) => {
    setReloading(true);

    getJobById({
      jobId,
      success: onSuccess,
      failure: onFailure,
    });
  };

  const getFilteredJobs = () => {
    if (tabIndex === 0) {
      return allJobs;
    }

    if (tabIndex === 1) {
      return allJobs.filter((job) => (
        job.statusName === JOB_STATUS.ASSIGNED ||
        job.statusName === JOB_STATUS.ACKNOWLEDGED ||
        job.statusName === JOB_STATUS.IN_PROGRESS1 ||
        job.statusName === JOB_STATUS.IN_PROGRESS2
      ));
    }

    if (tabIndex === 2) {
      return allJobs.filter((job) => (
        job.statusName === JOB_STATUS.COMPLETED ||
        job.statusName === JOB_STATUS.FAILED ||
        job.statusName === JOB_STATUS.CANCELLED
      ));
    }

    return allJobs;
  };

  const onItemPress = (job) => {
    onJobDetails(job.jobId);
  };

  const onCalendar = () => {
    showOverlay(CUSTOM_MODAL_SCREEN, {
      getContent: renderCalendarModal,
    });
  };

  const renderCalendarModal = (containerId) => {
    return (
      <DatePicker
        date={dateForJobs}
        onSelect={(date) => {
          updateDateForJobs(date);
          dismissOverlay(containerId);
        }}
      />
    );
  };

  const renderTabs = () => {
    return (
      <TabWrap>
        {
          tabs.map((tab, index) => (
            <TabItem
              key={tab}
              selected={index === tabIndex}
              onPress={() => setTabIndex(index)}
            >
              <TabText>{tab}</TabText>
            </TabItem>
          ))
        }
      </TabWrap>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <ItemWrap
        onPress={() => onItemPress(item)}
      >
        <JobCard jobInfo={item} />
      </ItemWrap>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Jobs</ScreenText>}
          leftIcon={<SideMenu />}
          onPressLeft={() => showDrawer(componentId)}
          rightIcon={<Calendar />}
          onPressRight={onCalendar}
        />
      </ShadowWrap>

      <Content>
        { renderTabs() }

        <ListWrap
          data={getFilteredJobs()}
          keyExtractor={(item) => `${item.jobId}`}
          renderItem={renderItem}
          onEndProcess={onEnd}
          onRefreshProcess={onRefresh}
          refreshing={refreshing}
        />

        {
          reloading &&
          <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        }
      </Content>

      <BottomBar componentId={componentId} activeIndex={1} />
    </Container>
  );
};

JobsScreen.propTypes = {
  allJobs: PropTypes.array.isRequired,
  pageOfJobs: PropTypes.number.isRequired,
  dateForJobs: PropTypes.string.isRequired,
  focusedJobId: PropTypes.number,
  coreScreenInfo: PropTypes.object.isRequired,
  isNetworkConnected: PropTypes.bool.isRequired,
  getJobsByDate: PropTypes.func.isRequired,
  getJobsByPage: PropTypes.func.isRequired,
  reloadJobsAndAlerts: PropTypes.func.isRequired,
  getJobById: PropTypes.func.isRequired,
  updateDateForJobs: PropTypes.func.isRequired,
  setCoreScreenInfo: PropTypes.func.isRequired,
  setIsNetworkConnected: PropTypes.func.isRequired,
  setNewCommentInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

JobsScreen.defaultProps = {
  focusedJobId: null,
};

const mapStateToProps = (state) => {
  return {
    allJobs: Jobs.selectors.getAllJobs(state),
    pageOfJobs: Jobs.selectors.getPageOfJobs(state),
    dateForJobs: Jobs.selectors.getDateForJobs(state),
    focusedJobId: Jobs.selectors.getFocusedJobId(state),
    coreScreenInfo: ViewStore.selectors.getCoreScreenInfo(state),
    isNetworkConnected: ViewStore.selectors.getIsNetworkConnected(state),
  };
};

const mapDispatchToProps = {
  getJobsByDate: Jobs.actionCreators.getJobsByDate,
  getJobsByPage: Jobs.actionCreators.getJobsByPage,
  reloadJobsAndAlerts: Jobs.actionCreators.reloadJobsAndAlerts,
  getJobById: Jobs.actionCreators.getJobById,
  updateDateForJobs: Jobs.actionCreators.updateDateForJobs,
  setCoreScreenInfo: ViewStore.actionCreators.setCoreScreenInfo,
  setIsNetworkConnected: ViewStore.actionCreators.setIsNetworkConnected,
  setNewCommentInfo: ViewStore.actionCreators.setNewCommentInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobsScreen);
