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
  TabWrap,
  TabItem,
} from './styled';

const { SideMenuIcon } = SVGS;

const JobsScreen = ({
  driverName,
  allJobs,
  countOfJobs,
  pageOfJobs,
  getJobsByDate,
  getJobsByPage,
  setFocusedJob,
  componentId,
}) => {
  const [ index, setIndex ] = useState(0);
  const [ tabs ] = useState([
    { key: 'first', color: COLORS.GRAY2 },
    { key: 'second', color: COLORS.BLUE1 },
    { key: 'third', color: COLORS.GREEN1 },
    { key: 'fourth', color: COLORS.RED1 },
  ]);
  const [ loading, setLoading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ date, setDate ] = useState(moment().format(DATE_FORMAT));

  const onDateSelect = (selectedDate) => {
    setLoading(true);
    setDate(selectedDate);

    getJobsByDate({
      date: selectedDate,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onEnd = () => {
    if (countOfJobs < pageOfJobs * 10) return;

    getJobsByPage({
      date,
      pageOfJobs,
      success: () => {},
      failure: () => {},
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    getJobsByDate({
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
      jobDate.format('DD ddd') !== moment(allJobs[index - 1].jobDate).format('DD ddd');

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

      {
        loading
        ? <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        : <ListWrap
            data={allJobs}
            keyExtractor={(item) => `${item.jobId}`}
            renderItem={renderItem}
            onEndProcess={onEnd}
            onRefreshProcess={onRefresh}
            refreshing={refreshing}
          />
      }

      <BottomBar componentId={componentId} activeIndex={1} />
    </Container>
  );
};

JobsScreen.propTypes = {
  driverName: PropTypes.string.isRequired,
  allJobs: PropTypes.array.isRequired,
  countOfJobs: PropTypes.number.isRequired,
  pageOfJobs: PropTypes.number.isRequired,
  getJobsByDate: PropTypes.func.isRequired,
  getJobsByPage: PropTypes.func.isRequired,
  setFocusedJob: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
    allJobs: Jobs.selectors.getAllJobs(state),
    countOfJobs: Jobs.selectors.getCountOfJobs(state),
    pageOfJobs: Jobs.selectors.getPageOfJobs(state),
  };
};

const mapDispatchToProps = {
  getJobsByDate: Jobs.actionCreators.getJobsByDate,
  getJobsByPage: Jobs.actionCreators.getJobsByPage,
  setFocusedJob: Jobs.actionCreators.setFocusedJob,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobsScreen);
