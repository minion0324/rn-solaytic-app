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
  DefaultButton,
} from 'src/components';
import {
  SVGS,
  COLORS,
  JOB_DATE,
} from 'src/constants';
import {
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
  HelloText,
} from 'src/styles/header.styles';
import {
  CardRow,
  DateWrap,
  DateText1,
  DateText2,
} from 'src/styles/card.styles';

import {
  ButtonWrap,
} from './styled';

const { SideMenuIcon } = SVGS;

const AlertScreen = ({
  driverName,
  allAlerts,
  countOfAlerts,
  pageOfAlerts,
  dateForAlerts,
  coreScreenInfo,
  setFCMToken,
  getAlertsByDate,
  getAlertsByPage,
  setFocusedJobId,
  acknowledgeJobs,
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
    pushNotifications.setNotificationOpenedHandler(onNotification);
  }, [coreScreenInfo]);

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
  }

  const onAcknowledge = () => {
    setLoading(true);

    const jobIds = allAlerts.map(item => item.jobId).join();

    acknowledgeJobs({
      jobIds,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onReloading = () => {
    setReloading(true);

    getAlertsByDate({
      dateForAlerts,
      success: () => setReloading(false),
      failure: () => setReloading(false),
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

  const onItemPress = (job) => {
    setFocusedJobId(job.jobId);
    pushScreen(componentId, JOB_DETAILS_SCREEN);
  };

  const renderItem = ({ item, index }) => {
    const jobDate = moment(item[JOB_DATE[0]] || item[JOB_DATE[1]]);

    const showDate =
      index === 0 ||
      jobDate.format('DD ddd') !== moment(allAlerts[index - 1][JOB_DATE[0]]).format('DD ddd');

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
              type={item.jobTypeName}
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
          leftIcon={<SideMenuIcon />}
          rightIcon={<HelloText>{`Hello ${driverName}`}</HelloText>}
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

      {
        reloading
        ? <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        : <ListWrap
            data={allAlerts}
            keyExtractor={(item) => `${item.jobId}`}
            renderItem={renderItem}
            onEndProcess={onEnd}
            onRefreshProcess={onRefresh}
            refreshing={refreshing}
          />
      }

      <BottomBar componentId={componentId} activeIndex={0} />
    </Container>
  );
};

AlertScreen.propTypes = {
  driverName: PropTypes.string.isRequired,
  allAlerts: PropTypes.array.isRequired,
  countOfAlerts: PropTypes.number.isRequired,
  pageOfAlerts: PropTypes.number.isRequired,
  dateForAlerts: PropTypes.string.isRequired,
  coreScreenInfo: PropTypes.object.isRequired,
  setFCMToken: PropTypes.func.isRequired,
  getAlertsByDate: PropTypes.func.isRequired,
  getAlertsByPage: PropTypes.func.isRequired,
  setFocusedJobId: PropTypes.func.isRequired,
  acknowledgeJobs: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
    allAlerts: Jobs.selectors.getAllAlerts(state),
    countOfAlerts: Jobs.selectors.getCountOfAlerts(state),
    pageOfAlerts: Jobs.selectors.getPageOfAlerts(state),
    dateForAlerts: Jobs.selectors.getDateForAlerts(state),
    coreScreenInfo: ViewStore.selectors.getCoreScreenInfo(state),
  };
};

const mapDispatchToProps = {
  setFCMToken: User.actionCreators.setFCMToken,
  getAlertsByDate: Jobs.actionCreators.getAlertsByDate,
  getAlertsByPage: Jobs.actionCreators.getAlertsByPage,
  setFocusedJobId: Jobs.actionCreators.setFocusedJobId,
  acknowledgeJobs: Jobs.actionCreators.acknowledgeJobs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlertScreen);
