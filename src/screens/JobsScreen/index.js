import React, { useState } from 'react';
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
  SVGS,
  COLORS,
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
  getJobsByDate,
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

  const toJobDetails = () => {
    pushScreen(componentId, JOB_DETAILS_SCREEN);
  };

  const onSuccess = () => {
    setLoading(false);
  };

  const onFailure = () => {
    setLoading(false);
  };

  const onDateSelect = (date) => {
    setLoading(true);
    getJobsByDate({
      date,
      success: onSuccess,
      failure: onFailure,
    });
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          leftIcon={<SideMenuIcon />}
          centerIcon={<DatePicker onSelect={onDateSelect} />}
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
            onEndProcess={() => { console.log('------------- on end reached') }}
          />
      }

      <BottomBar componentId={componentId} activeIndex={1} />
    </Container>
  );
};

JobsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
  allJobs: PropTypes.array.isRequired,
  getJobsByDate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
    allJobs: Jobs.selectors.getAllJobs(state),
  };
};

const mapDispatchToProps = {
  getJobsByDate: Jobs.actionCreators.getJobsByDate,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobsScreen);
