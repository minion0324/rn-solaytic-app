import React, { useState } from 'react';
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
  DatePicker,
} from 'src/components';
import {
  SVGS,
  COLORS,
  DATE_FORMAT,
} from 'src/constants';
import {
  pushScreen,
  JOB_DETAILS_SCREEN,
} from 'src/navigation';
import {
  User,
  Jobs,
} from 'src/redux';

import {
  Container,
  ShadowWrap,
  LoadingWrap,
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
  getAlertsByDate,
  getAlertsByPage,
  setFocusedJob,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ date, setDate ] = useState(moment().format(DATE_FORMAT));

  const onDateSelect = (selectedDate) => {
    setLoading(true);
    setDate(selectedDate);

    getAlertsByDate({
      date: selectedDate,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onEnd = () => {
    if (countOfAlerts < pageOfAlerts * 10) return;

    getAlertsByPage({
      date,
      pageOfAlerts,
      success: () => {},
      failure: () => {},
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    getAlertsByDate({
      date,
      success: () => setRefreshing(false),
      failure: () => setRefreshing(false),
    });
  };

  const onItemPress = (job) => {
    setFocusedJob(job);
    pushScreen(componentId, JOB_DETAILS_SCREEN);
  };

  const renderItem = ({ item, index }) => {
    const jobDate = moment(item.jobDate);

    const showDate =
      index === 0 ||
      jobDate.format('DD ddd') !== moment(allAlerts[index - 1].jobDate).format('DD ddd');

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
        <ItemWrap
          onPress={() => onItemPress(item)}
        >
          <JobCard
            customer={item.customerName}
            type={item.jobTypeName}
            location={''}
            time={jobDate.format('hh:mm A')}
            status={item.statusName}
          />
        </ItemWrap>
      </CardRow>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          leftIcon={<SideMenuIcon />}
          centerIcon={
            <DatePicker date={date} onSelect={onDateSelect} />
          }
          rightIcon={<HelloText>{`Hello ${driverName}`}</HelloText>}
        />
        <ButtonWrap>
          <DefaultButton
            text={'Acknowledge'}
            color={COLORS.BLUE1}
            mTop={-8}
          />
        </ButtonWrap>
      </ShadowWrap>

      {
        loading
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
  getAlertsByDate: PropTypes.func.isRequired,
  getAlertsByPage: PropTypes.func.isRequired,
  setFocusedJob: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
    allAlerts: Jobs.selectors.getAllAlerts(state),
    countOfAlerts: Jobs.selectors.getCountOfAlerts(state),
    pageOfAlerts: Jobs.selectors.getPageOfAlerts(state),
  };
};

const mapDispatchToProps = {
  getAlertsByDate: Jobs.actionCreators.getAlertsByDate,
  getAlertsByPage: Jobs.actionCreators.getAlertsByPage,
  setFocusedJob: Jobs.actionCreators.setFocusedJob,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlertScreen);
