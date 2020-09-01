import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';

import {
  HeaderBar,
  BottomBar,
  JobCard,
  ListWrap,
  ItemWrap,
  DefaultButton,
} from 'src/components';
import {
  SVGS,
  COLORS,
  SIZE4,
} from 'src/constants';
import {
  showDrawer,
  changeTabIndex,
  pushScreen,
  popToRootScreen,
  JOB_DETAILS_SCREEN,
} from 'src/navigation';
import {
  User,
  Jobs,
  ViewStore,
} from 'src/redux';
import {
  pushNotifications,
} from 'src/services';
import {
  delay,
  getDate,
} from 'src/utils';

import {
  Container,
  Content,
  ShadowWrap,
  LoadingWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyIcon,
  SideMenu,
} from 'src/styles/header.styles';

import {
  ButtonWrap,
  NoAlertsWrap,
  NoAlertsText,
  NoAlertsIcon,
} from './styled';

const { HappyIcon } = SVGS;

const AlertScreen = ({
  allAlerts,
  countOfAlerts,
  pageOfAlerts,
  dateForAlerts,
  coreScreenInfo,
  isRequiredUpdateTab,
  setFCMToken,
  getAlertsByDate,
  getAlertsByPage,
  reloadJobsAndAlerts,
  acknowledgeJobs,
  getJobById,
  updateDateForJobs,
  setIsRequiredUpdateTab,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

  useEffect(() => {
    pushNotifications.connect(setFCMToken);

    return () => {
      pushNotifications.disconnect();
    };
  }, []);

  useEffect(() => {
    pushNotifications.setNotificationHandlerForAlerts(onNotification);
  }, [coreScreenInfo]);

  useNavigationComponentDidAppear(() => {
    if (isRequiredUpdateTab) {
      changeTabIndex(componentId, 1);
      setIsRequiredUpdateTab(false);
    }
  });

  const onNotification = async () => {
    try {
      if (coreScreenInfo.componentType === 'push') {
        popToRootScreen(coreScreenInfo.componentId);
        await delay(100);
      }

      changeTabIndex(componentId, 0);
      await delay(100);

      onReloading();
    } catch (error) {
      //
    }
  };

  const onReloading = () => {
    setReloading(true);

    reloadJobsAndAlerts({
      success: () => setReloading(false),
      failure: () => setReloading(false),
    });
  };

  const onAcknowledge = () => {
    setLoading(true);

    const jobIds = allAlerts.map(item => item.jobId).join();

    acknowledgeJobs({
      jobIds,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onEnd = () => {
    getAlertsByPage({
      dateForAlerts,
      pageOfAlerts,
      success: () => {},
      failure: () => {},
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    getAlertsByDate({
      dateForAlerts,
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

  const onTodayJobs = () => {
    const date = getDate();
    updateDateForJobs(date);

    changeTabIndex(componentId, 1);
  };

  const onTomorrowJobs = () => {
    const date = getDate(moment().add(1, 'd'));
    updateDateForJobs(date);

    changeTabIndex(componentId, 1);
  };

  const renderNoAlerts = () => {
    return (
      <NoAlertsWrap>
        <NoAlertsText>
          {'Great!\nYou have no more alerts.'}
        </NoAlertsText>

        <NoAlertsIcon>
          <HappyIcon />
        </NoAlertsIcon>

        <NoAlertsText>
          {'View your jobs for'}
        </NoAlertsText>

        <DefaultButton
          text={'Today'}
          color={COLORS.BLUE1}
          onPress={onTodayJobs}
          mTop={SIZE4}
        />

        <DefaultButton
          text={'Tomorrow'}
          color={COLORS.WHITE1}
          onPress={onTomorrowJobs}
          textColor={COLORS.BLACK2}
          mTop={SIZE4}
        />
      </NoAlertsWrap>
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
          centerIcon={<ScreenText>Notifications</ScreenText>}
          leftIcon={<SideMenu />}
          onPressLeft={() => showDrawer(componentId)}
          rightIcon={<EmptyIcon />}
        />

        {
          countOfAlerts > 0 &&
          <ButtonWrap>
            <DefaultButton
              text={`Acknowledge (${countOfAlerts})`}
              color={COLORS.BLUE1}
              onPress={onAcknowledge}
              loading={loading}
              mTop={-8}
            />
          </ButtonWrap>
        }
      </ShadowWrap>

      <Content>
        <ListWrap
          data={allAlerts}
          keyExtractor={(item) => `${item.jobId}`}
          renderItem={renderItem}
          onEndProcess={onEnd}
          onRefreshProcess={onRefresh}
          refreshing={refreshing}
        />

        {
          countOfAlerts === 0 &&
          renderNoAlerts()
        }

        {
          reloading &&
          <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        }
      </Content>

      <BottomBar componentId={componentId} activeIndex={0} />
    </Container>
  );
};

AlertScreen.propTypes = {
  allAlerts: PropTypes.array.isRequired,
  countOfAlerts: PropTypes.number.isRequired,
  pageOfAlerts: PropTypes.number.isRequired,
  dateForAlerts: PropTypes.string.isRequired,
  coreScreenInfo: PropTypes.object.isRequired,
  isRequiredUpdateTab: PropTypes.bool.isRequired,
  setFCMToken: PropTypes.func.isRequired,
  getAlertsByDate: PropTypes.func.isRequired,
  getAlertsByPage: PropTypes.func.isRequired,
  reloadJobsAndAlerts: PropTypes.func.isRequired,
  acknowledgeJobs: PropTypes.func.isRequired,
  getJobById: PropTypes.func.isRequired,
  updateDateForJobs: PropTypes.func.isRequired,
  setIsRequiredUpdateTab: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    allAlerts: Jobs.selectors.getAllAlerts(state),
    countOfAlerts: Jobs.selectors.getCountOfAlerts(state),
    pageOfAlerts: Jobs.selectors.getPageOfAlerts(state),
    dateForAlerts: Jobs.selectors.getDateForAlerts(state),
    coreScreenInfo: ViewStore.selectors.getCoreScreenInfo(state),
    isRequiredUpdateTab: ViewStore.selectors.getIsRequiredUpdateTab(state),
  };
};

const mapDispatchToProps = {
  setFCMToken: User.actionCreators.setFCMToken,
  getAlertsByDate: Jobs.actionCreators.getAlertsByDate,
  getAlertsByPage: Jobs.actionCreators.getAlertsByPage,
  reloadJobsAndAlerts: Jobs.actionCreators.reloadJobsAndAlerts,
  acknowledgeJobs: Jobs.actionCreators.acknowledgeJobs,
  getJobById: Jobs.actionCreators.getJobById,
  updateDateForJobs: Jobs.actionCreators.updateDateForJobs,
  setIsRequiredUpdateTab: ViewStore.actionCreators.setIsRequiredUpdateTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlertScreen);
