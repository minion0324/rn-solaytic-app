import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { sortBy } from 'lodash';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE5,
  SIZE16,
  SIZE22,
  FONT,
  JOB_STATUS,
  JOB_TYPE,
} from 'src/constants';

import {
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';

const {
  LocationIcon,
} = SVGS;

const Container = styled.View`
  height: ${SIZE22}px;
  padding: ${SIZE2}px;
`;

const StatusWrap = styled.View`
  position: absolute;
  top: ${SIZE2}px;
  right: 0px;
  width: ${SIZE16}px;
  height: ${SIZE5}px;
  background-color: ${props => props.color + '15'};
  border-top-left-radius: ${SIZE1}px;
  border-bottom-left-radius: ${SIZE1}px;
  align-items: center;
  justify-content: center;
`;

const StatusText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${props => props.color};
  text-align: center;
`;

const ContentWrap = styled.View`
  height: 100%;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${(props) => (
    props.hasBorder
    ? COLORS.GRAY2 : COLORS.TRANSPARENT1
  )};
`;

const InfoWrap = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
  border-right-width: 1px;
  border-color: ${(props) => (
    props.hasBorder
    ? COLORS.GRAY2 : COLORS.TRANSPARENT1
  )};
  padding-horizontal: ${SIZE1}px;
`;

const TimeText = styled.Text`
  font-size: ${FONT(13)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const CustomerText = styled.Text`
  width: ${(props) => (
    props.full ? '100%' : '70%'
  )};
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LocationText = styled.Text`
  width: 90%;
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.GRAY3};
  margin-left: ${SIZE1}px;
`;

const InfoText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.GRAY3};
  text-align: center;
`;

const DATE_FORMAT = 'DD (ddd)';
const TIME_FORMAT = 'hh:mm A ';

const JobCard = ({
  jobInfo: {
    steps: originSteps,
    customerName,
    statusName,
    jobDate,
    jobTemplateName,
    jobTimeSpecific,
    jobTypeName,
  },
}) => {
  const steps = useMemo(() => {
    return sortBy(originSteps, 'stepOrder');
  }, [originSteps]);

  const statusColor = useMemo(() => {
    switch (statusName) {
      case JOB_STATUS.STARTED:
        return COLORS.BLUE1;

      case JOB_STATUS.IN_PROGRESS:
        return COLORS.PURPLE1;

      case JOB_STATUS.COMPLETED:
        return COLORS.GREEN1;

      case JOB_STATUS.FAILED:
      case JOB_STATUS.CANCELLED:
        return COLORS.RED1;

      default:
        return null;
    };
  }, [statusName]);

  const location = useMemo(() => {
    switch (jobTypeName) {
      case JOB_TYPE.PULL:
        return steps[0].address || steps[1].address;

      case JOB_TYPE.PUT:
      case JOB_TYPE.EXCHANGE:
      case JOB_TYPE.ON_THE_SPOT:
        return steps[1].address || steps[0].address;

      case JOB_TYPE.OUT:
      case JOB_TYPE.SHIFT:
      case JOB_TYPE.THROW_AT_CUSTOMER:
        return steps[2].address || steps[1].address || steps[0].address;

      default:
        return steps[2].address || steps[1].address || steps[0].address;
    };
  }, [jobTypeName]);

  const binIndex = useMemo(() => {
    if (jobTypeName === JOB_TYPE.EXCHANGE) {
      return 1;
    }

    return 0;
  }, [jobTypeName]);

  return (
    <Container>
      {
        statusColor &&
        <StatusWrap color={statusColor}>
          <StatusText color={statusColor}>
            {statusName}
          </StatusText>
        </StatusWrap>
      }
      <FlexWrap flex={2}>
        <ContentWrap hasBorder>
          <FlexWrap flex={2}>
            <TimeText numberOfLines={1}>
              {
                moment(jobTimeSpecific || jobDate).format(DATE_FORMAT)
              }
            </TimeText>
            <SpaceView mTop={SIZE1} />
            <TimeText numberOfLines={1}>
              {
                jobTimeSpecific
                ? moment(jobTimeSpecific).format(TIME_FORMAT) : ''
              }
            </TimeText>
          </FlexWrap>
          <SpaceView mLeft={SIZE1} />
          <FlexWrap flex={7}>
            <CustomerText
              numberOfLines={1}
              full={!statusColor}
            >
              {customerName}
            </CustomerText>
            <SpaceView mTop={SIZE1} />
            <LocationRow>
              <LocationIcon />
              <LocationText numberOfLines={1}>
                {location}
              </LocationText>
            </LocationRow>
          </FlexWrap>
        </ContentWrap>
      </FlexWrap>
      <SpaceView mTop={SIZE1} />
      <FlexWrap flex={1}>
        <ContentWrap>
          <FlexWrap flex={2}>
            <InfoWrap hasBorder>
              <InfoText numberOfLines={2}>
                {jobTemplateName || jobTypeName}
              </InfoText>
            </InfoWrap>
          </FlexWrap>
          <FlexWrap flex={3}>
            <InfoWrap hasBorder>
              <InfoText numberOfLines={2}>
                {steps[binIndex].binTypeName || ''}
              </InfoText>
            </InfoWrap>
          </FlexWrap>
          <FlexWrap flex={4}>
            <InfoWrap>
              <InfoText numberOfLines={2}>
                {steps[binIndex].wasteTypeName || ''}
              </InfoText>
            </InfoWrap>
          </FlexWrap>
        </ContentWrap>
      </FlexWrap>
    </Container>
  );
}

JobCard.propTypes = {
  jobInfo: PropTypes.shape({
    steps: PropTypes.array.isRequired,
    customerName: PropTypes.string.isRequired,
    statusName: PropTypes.string.isRequired,
    jobDate: PropTypes.string.isRequired,
    jobTemplateName: PropTypes.string.isRequired,
    jobTimeSpecific: PropTypes.string.isRequired,
    jobTypeName: PropTypes.string.isRequired,
  }).isRequired,
}

export default JobCard;
