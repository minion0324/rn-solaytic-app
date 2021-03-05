import React, { useMemo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { sortBy } from 'lodash';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE8,
  SIZE20,
  FONT,
  JOB_STATUS,
  JOB_TYPE,
} from 'src/constants';

import {
  BorderView,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';

const {
  MessageIcon,
  CircleCurrencyIcon,
} = SVGS;

const Container = styled.View`
  min-height: ${SIZE20}px;
`;

const StatusText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 700;
  color: ${props => props.color};
  text-align: center;
  text-transform: uppercase;
`;

const InfoWrap = styled.View`
  height: ${SIZE8}px;
  align-items: center;
  justify-content: center;
  border-right-width: 1px;
  border-color: ${(props) => (
    props.hasBorder
    ? COLORS.GRAY2 : COLORS.TRANSPARENT1
  )};
  padding-vertical: ${SIZE1}px;
  padding-horizontal: ${SIZE2}px;
`;

const TimeText = styled.Text`
  font-size: ${FONT(13)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const LocationText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
`;

const InfoText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.GRAY3};
  text-align: center;
`;

const InstructionText = styled.Text`
  font-size: ${FONT(13)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const DATE_FORMAT = 'DD (ddd)';
const TIME_FORMAT = 'hh:mm A ';

const JobCard = ({
  jobInfo: {
    steps: originSteps,
    statusName,
    jobDate,
    jobTemplateName,
    jobTimeSpecific,
    jobTypeName,
    isRequirePaymentCollection,
    instructionToDrivers,
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
    const index = steps.findIndex(item => item.customerSiteId);
    if (index !== -1) {
      return steps[index].address;
    }

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
      <View>
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <FlexWrap>
            <RowWrap>
              <SpaceView mLeft={SIZE2} />
              <TimeText numberOfLines={1}>
                {
                  moment(jobTimeSpecific || jobDate).format(DATE_FORMAT)
                }
              </TimeText>
              {
                !!jobTimeSpecific &&
                <RowWrap>
                  <SpaceView mLeft={SIZE1} />
                  <TimeText numberOfLines={1}>
                    {
                      moment(jobTimeSpecific).format(TIME_FORMAT)
                    }
                  </TimeText>
                </RowWrap>
              }
              {
                isRequirePaymentCollection &&
                <RowWrap>
                  <SpaceView mLeft={SIZE2} />
                  <CircleCurrencyIcon />
                </RowWrap>
              }
            </RowWrap>
          </FlexWrap>
          {
            statusColor &&
            <StatusText color={statusColor}>
              {statusName}
            </StatusText>
          }
          <SpaceView mLeft={SIZE2} />
        </RowWrap>
      </View>
      <View>
        <SpaceView mTop={SIZE1} />
        <RowWrap>
          <SpaceView mLeft={SIZE2} />
          <FlexWrap>
            <LocationText numberOfLines={1}>
              {location}
            </LocationText>
          </FlexWrap>
          <SpaceView mLeft={SIZE2} />
        </RowWrap>
        <SpaceView mTop={SIZE1} />
      </View>
      <BorderView />
      <FlexWrap>
        <RowWrap>
          <FlexWrap flex={3}>
            <InfoWrap hasBorder>
              <InfoText numberOfLines={2}>
                {jobTemplateName || jobTypeName}
              </InfoText>
            </InfoWrap>
          </FlexWrap>
          <FlexWrap flex={2}>
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
        </RowWrap>
      </FlexWrap>
      {
        !!instructionToDrivers &&
        <View>
          <BorderView />
          <SpaceView mTop={SIZE1} />
          <RowWrap>
            <SpaceView mLeft={SIZE2} />
            <MessageIcon />
            <SpaceView mLeft={SIZE1} />
            <FlexWrap>
              <InstructionText numberOfLines={1}>
                {instructionToDrivers}
              </InstructionText>
            </FlexWrap>
            <SpaceView mLeft={SIZE2} />
          </RowWrap>
          <SpaceView mTop={SIZE2} />
        </View>
      }
    </Container>
  );
};

JobCard.propTypes = {
  jobInfo: PropTypes.shape({
    steps: PropTypes.array.isRequired,
    statusName: PropTypes.string.isRequired,
    jobDate: PropTypes.string.isRequired,
    jobTemplateName: PropTypes.string.isRequired,
    jobTimeSpecific: PropTypes.string.isRequired,
    jobTypeName: PropTypes.string.isRequired,
    isRequirePaymentCollection: PropTypes.bool.isRequired,
    instructionToDrivers: PropTypes.string.isRequired,
  }).isRequired,
};

export default JobCard;
