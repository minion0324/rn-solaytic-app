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
  SIZE4,
  SIZE6,
  SIZE8,
  SIZE10,
  SIZE20,
  FONT,
  JOB_STATUS,
  JOB_TYPE,
} from 'src/constants';

import {
  RowWrap,
  FlexWrap,
  SpaceView,
  BorderView,
} from 'src/styles/common.styles';

const {
  MessageIcon,
  CircleCurrencyIcon,
} = SVGS;

const Container = styled.View`

`;

const FirstSection = styled.View`
  height: ${SIZE20}px;
  justify-content: center;
`;

const SecondSection = styled.View`
  height: ${SIZE10}px;
  justify-content: center;
  align-items: flex-start;
  border-width: 1px;
  border-radius: ${SIZE1}px;
  border-color: ${COLORS.GRAY2};
  padding-horizontal: ${SIZE2}px;
  margin-horizontal: ${SIZE2}px;
  margin-bottom: ${SIZE2}px;
`;

const ThirdSection = styled.View`
  justify-content: center;
  border-width: 1px;
  border-radius: ${SIZE1}px;
  border-color: ${COLORS.GRAY2};
  padding: ${SIZE2}px;
  margin-horizontal: ${SIZE2}px;
  margin-bottom: ${SIZE2}px;
`;

const StatusWrap = styled.View`
  border-width: 1px;
  border-color: ${COLORS.BLUE1};
  border-radius: ${SIZE8}px;
  padding-horizontal: ${SIZE2}px;
  padding-vertical: ${SIZE1}px;
`;

const StatusText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${props => props.color};
  text-align: center;
  text-transform: uppercase;
`;

const TimeText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

const CustomerInfo = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLUE5};
`;

const NormalText = styled.Text`
  font-size: ${FONT(12)}px;
  color: ${COLORS.BLACK2};
`;

const InfoText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 700;
  color: ${COLORS.BLACK2};
  text-align: center;
`;

const InstructionText = styled.Text`
  font-size: ${FONT(13)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const SVGWarp = styled.View`
  width: ${SIZE6}px;
`;

const NotifyNumWarp = styled.View`
  position: absolute;
  background-color: ${COLORS.RED1};
  border-radius: ${SIZE4}px;
  top: 5px;
  left: 5px;
  padding-horizontal: 4px;
`;

const NotifyNumWarpText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.WHITE1};
`;

const DATE_FORMAT = 'DD (ddd)';
const TIME_FORMAT = 'hh:mm A ';

const JobCard = ({
  jobInfo: {
    customer: {
      accountCustomerId,
    },
    customerName,
    noOfNewMessages,
    steps: originSteps,
    statusName,
    jobDate,
    jobTemplateName,
    jobTimeSpecific,
    jobTypeName,
    isRequirePaymentCollection,
    instructionToDrivers,
    siteRemarks
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
    let customerSiteStep = null;

    const index = steps.findIndex(item => item.customerSiteId);
    if (index !== -1) {
      customerSiteStep = steps[index];
    } else {
      switch (jobTypeName) {
        case JOB_TYPE.PULL:
          customerSiteStep = steps[0] || steps[1];
          break;

        case JOB_TYPE.PUT:
        case JOB_TYPE.EXCHANGE:
        case JOB_TYPE.ON_THE_SPOT:
          customerSiteStep = steps[1] || steps[0];
          break;

        case JOB_TYPE.OUT:
        case JOB_TYPE.SHIFT:
        case JOB_TYPE.THROW_AT_CUSTOMER:
          customerSiteStep = steps[2] || steps[1] || steps[0];
          break;

        default:
          customerSiteStep = steps[2] || steps[1] || steps[0];
          break;
      };
    }

    return customerSiteStep.fullAddress || customerSiteStep.address;
  }, [jobTypeName]);

  const binIndex = useMemo(() => {
    if (jobTypeName === JOB_TYPE.EXCHANGE) {
      return 1;
    }

    return 0;
  }, [jobTypeName]);

  return (
    <Container>
      <FirstSection>
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
            </RowWrap>
          </FlexWrap>
          {
            statusColor &&
            <StatusWrap>
              <StatusText color={statusColor}>
                {statusName}
              </StatusText>
            </StatusWrap>
          }
          <SpaceView mLeft={SIZE2} />
        </RowWrap>
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <SpaceView mLeft={SIZE2} />
          <FlexWrap>
            <CustomerInfo numberOfLines={1}>
              {`[${accountCustomerId}] ${customerName}`}
            </CustomerInfo>
          </FlexWrap>
        </RowWrap>
        <SpaceView mTop={SIZE1} />
        <RowWrap>
          <SpaceView mLeft={SIZE2} />
          <FlexWrap>
            <NormalText numberOfLines={2}>
              {location}
            </NormalText>
          </FlexWrap>
          <SpaceView mLeft={SIZE2} />
        </RowWrap>
        <SpaceView mTop={SIZE1} />
      </FirstSection>
      <SecondSection>
        <InfoText numberOfLines={1}>
          {jobTemplateName || jobTypeName}
        </InfoText>
        <SpaceView mTop={SIZE1} />
        <RowWrap>
          <NormalText numberOfLines={2}>
            {steps[binIndex].binTypeName || ''}
          </NormalText>
          <SpaceView mLeft={SIZE2} />
          <NormalText numberOfLines={2}>
            {steps[binIndex].wasteTypeName || ''}
          </NormalText>
        </RowWrap>
      </SecondSection>
      <ThirdSection>
        {
          // isRequirePaymentCollection &&
          <RowWrap>
            <SVGWarp>
              <CircleCurrencyIcon />
            </SVGWarp>
            <InfoText numberOfLines={1}>
              Cash -
            </InfoText>
            <SpaceView mLeft={SIZE1} />
            <NormalText numberOfLines={1}>
              ${steps[binIndex + 1].amountToCollect}
            </NormalText>
          </RowWrap>
        }
        {
          !!instructionToDrivers &&
          <Container>
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <SVGWarp>
                <MessageIcon />
                {
                  noOfNewMessages &&
                  <NotifyNumWarp>
                    <NotifyNumWarpText>
                      {noOfNewMessages}
                    </NotifyNumWarpText>
                  </NotifyNumWarp>
                }
              </SVGWarp>
              <FlexWrap>
                <InstructionText numberOfLines={2}>
                  {siteRemarks ? siteRemarks : '---'}
                </InstructionText>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
            </RowWrap>
            <SpaceView mTop={SIZE1} />
            <BorderView mLeft={SIZE6} />
            <SpaceView mTop={SIZE1} />
            <RowWrap>
              <SVGWarp>
              </SVGWarp>
              <FlexWrap>
                <InstructionText numberOfLines={2}>
                  {instructionToDrivers}
                </InstructionText>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
            </RowWrap>
          </Container>
        }
      </ThirdSection>
    </Container>
  );
};

JobCard.propTypes = {
  jobInfo: PropTypes.shape({
    customerName: PropTypes.string.isRequired,
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
