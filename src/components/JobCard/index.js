import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  SIZE20,
  FONT,
  JOB_STATUS,
} from 'src/constants';

const {
  LocationIcon,
} = SVGS;

const Container = styled.View`
  height: ${SIZE20}px;
  flex-direction: row;

`;

const Status = styled.View`
  background-color: ${props => props.color || COLORS.BLUE1};
  width: ${SIZE1}px;
  height: 100%;
  border-top-left-radius: ${SIZE2}px;
  border-bottom-left-radius: ${SIZE2}px;
`;

const Content = styled.View`
  flex: 1;
  height: 100%;
  justify-content: space-between;
  padding-left: ${SIZE3}px;
  padding-top: ${SIZE3}px;
  padding-right: ${SIZE2}px;
  padding-bottom: ${SIZE4}px;
`;

const TimeRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TimeText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 700;
  color: ${COLORS.BLUE1};
`;

const TypeWrap = styled.View`
  width: ${SIZE20}px;
  height: ${SIZE4}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.BLUE2};
  border-radius: ${SIZE1}px;
`;

const TypeText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.BLUE1};
`;

const CustomerText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK1};
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LocationText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.GRAY3};
  margin-left: ${SIZE1}px;
`;

const JobCard = ({
  customer,
  type,
  location,
  time,
  status,
}) => {
  const getColorByStatus = () => {
    switch (status) {
      case JOB_STATUS.UNASSIGNED:
      case JOB_STATUS.DISPATCHED:
        return COLORS.GRAY2;

      case JOB_STATUS.ASSIGNED:
      case JOB_STATUS.ACKNOWLEDGED:
      case JOB_STATUS.IN_PROGRESS1:
      case JOB_STATUS.IN_PROGRESS2:
        return COLORS.BLUE1;

      case JOB_STATUS.COMPLETED:
        return COLORS.GREEN1;

      case JOB_STATUS.FAILED:
      case JOB_STATUS.CANCELLED:
        return COLORS.RED1;

      default:
        return COLORS.BLUE1;
    };
  };

  return (
    <Container>
      <Status color={getColorByStatus()} />
      <Content>
        <TimeRow>
          <TimeText>{time}</TimeText>
          <TypeWrap>
            <TypeText>{type}</TypeText>
          </TypeWrap>
        </TimeRow>
        <CustomerText>{customer}</CustomerText>
        <LocationRow>
          <LocationIcon />
          <LocationText>{location}</LocationText>
        </LocationRow>
      </Content>
    </Container>
  );
}

JobCard.propTypes = {
  customer: PropTypes.string,
  type: PropTypes.string,
  location: PropTypes.string,
  time: PropTypes.string,
  status: PropTypes.string,
}

JobCard.defaultProps = {
  customer: '',
  type: '',
  location: '',
  time: '',
  status: '',
}

export default JobCard;
