import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  HeaderBar,
  BottomBar,
  JobCard,
  ListWrap,
  ItemWrap,
  DatePicker,
} from 'src/components';
import {
  SVGS,
  COLORS,
  JOB_DATE,
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
  getJobCustomerAddress,
} from 'src/utils';

import {
  Container,
  ShadowWrap,
  LoadingWrap,
  FlexWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
} from 'src/styles/header.styles';
import {
  CardRow,
  DateWrap,
  DateText1,
  DateText2,
} from 'src/styles/card.styles';

import {
  TabWrap,
  TabItem,
} from './styled';

const { SideMenuIcon } = SVGS;

const JobsScreen = ({
  driverName,
  allJobs,
  pageOfJobs,
  dateForJobs,
  coreScreenInfo,
  getJobsByDate,
  getJobsByPage,
  reloadJobsAndAlerts,
  getJobById,
  componentId,
}) => {
  const [ tabs ] = useState([
    { key: 'first', color: COLORS.GRAY2 },
    { key: 'second', color: COLORS.BLUE1 },
    { key: 'third', color: COLORS.GREEN1 },
    { key: 'fourth', color: COLORS.RED1 },
  ]);
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

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

  const onDateSelect = (selectedDate) => {
    setReloading(true);

    getJobsByDate({
      dateForJobs: selectedDate,
      success: () => setReloading(false),
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

  const onItemPress = (job) => {
    onJobDetails(job.jobId);
  };

  const renderItem = ({ item, index }) => {
    const jobDate = moment(item[JOB_DATE[0]] || item[JOB_DATE[1]]);

    const showDate =
      index === 0 ||
      jobDate.format('DD ddd') !== moment(allJobs[index - 1][JOB_DATE[0]]).format('DD ddd');

    return (
      <CardRow>
        {
          showDate
          ? <DateWrap>
              <DateText1>{jobDate.format('DD')}</DateText1>
              <DateText2>{jobDate.format('ddd')}</DateText2>
            </DateWrap>
          : <DateWrap />
        }
        <FlexWrap>
          <ItemWrap
            onPress={() => onItemPress(item)}
          >
            <JobCard
              customer={item.customerName}
              type={item.jobTemplateName || item.jobTypeName}
              location={getJobCustomerAddress(item)}
              time={jobDate.format('hh:mm A')}
              status={item.statusName}
            />
          </ItemWrap>
        </FlexWrap>
      </CardRow>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Jobs</ScreenText>}
          leftIcon={<SideMenuIcon />}
          onPressLeft={() => showDrawer(componentId)}
        />
        <TabWrap>
          {
            tabs.map((item) => (
              <TabItem
                key={item.key}
                color={item.color}
              />
            ))
          }
        </TabWrap>
      </ShadowWrap>

      <FlexWrap>
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
      </FlexWrap>

      <BottomBar componentId={componentId} activeIndex={1} />
    </Container>
  );
};

JobsScreen.propTypes = {
  driverName: PropTypes.string.isRequired,
  allJobs: PropTypes.array.isRequired,
  pageOfJobs: PropTypes.number.isRequired,
  dateForJobs: PropTypes.string.isRequired,
  coreScreenInfo: PropTypes.object.isRequired,
  getJobsByDate: PropTypes.func.isRequired,
  getJobsByPage: PropTypes.func.isRequired,
  reloadJobsAndAlerts: PropTypes.func.isRequired,
  getJobById: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobsScreen);
