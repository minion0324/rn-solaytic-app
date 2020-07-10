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
  JOB_DATE,
  JOB_TYPE,
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
  dateForJobs,
  getJobsByDate,
  getJobsByPage,
  setFocusedJobId,
  componentId,
}) => {
  const [ tabs ] = useState([
    { key: 'first', color: COLORS.GRAY2 },
    { key: 'second', color: COLORS.BLUE1 },
    { key: 'third', color: COLORS.GREEN1 },
    { key: 'fourth', color: COLORS.RED1 },
  ]);
  const [ loading, setLoading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

  const onDateSelect = (selectedDate) => {
    setLoading(true);

    getJobsByDate({
      dateForJobs: selectedDate,
      success: () => setLoading(false),
      failure: () => setLoading(false),
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

  const onItemPress = (job) => {
    setFocusedJobId(job.jobId);
    pushScreen(componentId, JOB_DETAILS_SCREEN);
  };

  const getJobCustomerAddress = (job) => {
    switch (job.jobTypeName) {
      case JOB_TYPE.PULL:
        return job.steps[0].address || job.steps[1].address;

      case JOB_TYPE.PUT:
      case JOB_TYPE.EXCHANGE:
      case JOB_TYPE.ON_THE_SPOT:
        return job.steps[1].address || job.steps[0].address;

      case JOB_TYPE.OUT:
      case JOB_TYPE.SHIFT:
      case JOB_TYPE.THROW_AT_CUSTOMER:
        return job.steps[2].address || job.steps[1].address || job.steps[0].address;

      default:
        return job.steps[2].address || job.steps[1].address || job.steps[0].address;
    };
  }

  const renderItem = ({ item, index }) => {
    const jobDate = moment(item[JOB_DATE]);

    const showDate =
      index === 0 ||
      jobDate.format('DD ddd') !== moment(allJobs[index - 1][JOB_DATE]).format('DD ddd');

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
            location={getJobCustomerAddress(item)}
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
            <DatePicker date={dateForJobs} onSelect={onDateSelect} />
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
  dateForJobs: PropTypes.string.isRequired,
  getJobsByDate: PropTypes.func.isRequired,
  getJobsByPage: PropTypes.func.isRequired,
  setFocusedJobId: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
    allJobs: Jobs.selectors.getAllJobs(state),
    countOfJobs: Jobs.selectors.getCountOfJobs(state),
    pageOfJobs: Jobs.selectors.getPageOfJobs(state),
    dateForJobs: Jobs.selectors.getDateForJobs(state),
  };
};

const mapDispatchToProps = {
  getJobsByDate: Jobs.actionCreators.getJobsByDate,
  getJobsByPage: Jobs.actionCreators.getJobsByPage,
  setFocusedJobId: Jobs.actionCreators.setFocusedJobId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobsScreen);
