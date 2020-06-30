import React, { useState } from 'react';
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
  getAlertsByDate,
  getAlertsByPage,
  setFocusedJob,
  componentId,
}) => {
  const [ refreshing, setRefreshing ] = useState(false);

  const onEnd = () => {
    if (countOfAlerts < pageOfAlerts * 10) return;

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
          rightIcon={<HelloText>{`Hello ${driverName}`}</HelloText>}
        />

        {
          countOfAlerts > 0 &&
          <ButtonWrap>
            <DefaultButton
              text={`Acknowledge (${countOfAlerts})`}
              color={COLORS.BLUE1}
              mTop={-8}
            />
          </ButtonWrap>
        }
      </ShadowWrap>

      <ListWrap
        data={allAlerts}
        keyExtractor={(item) => `${item.jobId}`}
        renderItem={renderItem}
        onEndProcess={onEnd}
        onRefreshProcess={onRefresh}
        refreshing={refreshing}
      />

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
    dateForAlerts: Jobs.selectors.getDateForAlerts(state),
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
