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
  pageIndex,
  getJobsByDate,
  getJobsByPage,
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

  const toJobDetails = () => {
    pushScreen(componentId, JOB_DETAILS_SCREEN);
  };

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
    if (countOfJobs < pageIndex * 10) return;

    getJobsByPage({
      date,
      pageIndex,
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
            renderItem={({ item, index }) => (
              <CardRow>
                <DateWrap>
                  <DateText1>15</DateText1>
                  <DateText2>Mon</DateText2>
                </DateWrap>
                <ItemWrap
                  onPress={toJobDetails}
                >
                  <JobCard />
                </ItemWrap>
              </CardRow>
            )}
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
  componentId: PropTypes.string.isRequired,
  allJobs: PropTypes.array.isRequired,
  countOfJobs: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  getJobsByDate: PropTypes.func.isRequired,
  getJobsByPage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
    allJobs: Jobs.selectors.getAllJobs(state),
    countOfJobs: Jobs.selectors.getCountOfJobs(state),
    pageIndex: Jobs.selectors.getPageIndex(state),
  };
};

const mapDispatchToProps = {
  getJobsByDate: Jobs.actionCreators.getJobsByDate,
  getJobsByPage: Jobs.actionCreators.getJobsByPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobsScreen);
