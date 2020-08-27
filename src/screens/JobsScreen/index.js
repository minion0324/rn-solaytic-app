import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
  changeTabIndex,
  pushScreen,
  popToRootScreen,
  JOB_DETAILS_SCREEN,
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
  //
} from './styled';

const JobsScreen = ({
  allJobs,
  pageOfJobs,
  dateForJobs,
  coreScreenInfo,
  getJobsByDate,
  getJobsByPage,
  reloadJobsAndAlerts,
  getJobById,
  updateDateForJobs,
  componentId,
}) => {
  const [ datePicker, setDatePicker ] = useState(false);
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

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

  const onNotification = async (jobId) => {
    try {
      if (coreScreenInfo.componentType === 'push') {
        popToRootScreen(coreScreenInfo.componentId);
        await delay(100);
      }

      changeTabIndex(componentId, 1);
      await delay(100);

      onReloading(jobId);
    } catch (error) {
      //
    }
  }

  const onReloading = (jobId) => {
    setReloading(true);

    reloadJobsAndAlerts({
      success: () => onJobDetails(jobId),
      failure: () => setReloading(false),
    });
  };

  const onDateSelect = (date) => {
    updateDateForJobs(date);
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

  const onItemPress = (job) => {
    onJobDetails(job.jobId);
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
          onPressRight={() => setDatePicker(true)}
        />
      </ShadowWrap>

      <Content>
        {
          datePicker &&
          <DatePicker />
        }

        <ListWrap
          data={allJobs}
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
  coreScreenInfo: PropTypes.object.isRequired,
  getJobsByDate: PropTypes.func.isRequired,
  getJobsByPage: PropTypes.func.isRequired,
  reloadJobsAndAlerts: PropTypes.func.isRequired,
  getJobById: PropTypes.func.isRequired,
  updateDateForJobs: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    allJobs: Jobs.selectors.getAllJobs(state),
    pageOfJobs: Jobs.selectors.getPageOfJobs(state),
    dateForJobs: Jobs.selectors.getDateForJobs(state),
    coreScreenInfo: ViewStore.selectors.getCoreScreenInfo(state),
  };
};

const mapDispatchToProps = {
  getJobsByDate: Jobs.actionCreators.getJobsByDate,
  getJobsByPage: Jobs.actionCreators.getJobsByPage,
  reloadJobsAndAlerts: Jobs.actionCreators.reloadJobsAndAlerts,
  getJobById: Jobs.actionCreators.getJobById,
  updateDateForJobs: Jobs.actionCreators.updateDateForJobs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobsScreen);
