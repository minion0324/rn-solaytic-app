import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SVGS,
  COLORS,
  COMMON_PADDING,
  FONT,
} from 'src/constants';

const {
  DeactiveCheckIcon,
  BlueActiveCheckIcon,
  ArrowIcon,
  LocationIcon,
} = SVGS;

const Container = styled.View`
  padding: ${COMMON_PADDING}px;
  background-color: ${COLORS.WHITE1};
`;

const CheckRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CheckText = styled.Text`
  font-size: ${FONT(12)}px;
  opacity: 0.7;
  color: ${COLORS.BLACK2};
  text-transform: uppercase;
  margin-left: ${COMMON_PADDING}px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${COMMON_PADDING * 1.5}px;
  margin-right: ${COMMON_PADDING}px;
`;

const TitleText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${COMMON_PADDING / 2}px;
`;

const LocationText = styled.Text`
  font-size: ${FONT(12)}px;
  opacity: 0.7;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  margin-left: ${COMMON_PADDING / 2}px;
`;

const Border = styled.View`
  width: 100%;
  border-width: 1px;
  border-color: ${COLORS.WHITE3};
  margin-vertical: ${COMMON_PADDING * 1.5}px;
`;

const DateTimeRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DateTimeText = styled.Text`
  font-size: ${FONT(12)}px;
  opacity: 0.2;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: ${COMMON_PADDING}px;
  margin-bottom: ${COMMON_PADDING * 0.5}px;
`;

const StatusText = styled.Text`
  font-size: ${FONT(12)}px;
  opacity: 0.7;
  font-weight: 500;
  text-transform: uppercase;
  color: ${COLORS.BLACK2};
`;

const JobCard = ({
  checked,
  checkText,
  title,
  scope,
  location,
  date,
  time,
  status,
}) => {
  return (
    <Container>
      <CheckRow>
        {
          checked ? <BlueActiveCheckIcon /> : <DeactiveCheckIcon />
        }
        <CheckText>{checkText}</CheckText>
      </CheckRow>

      <TitleRow>
        <TitleText>{title}</TitleText>
        { !!scope && <ArrowIcon /> }
        <TitleText>{scope}</TitleText>
      </TitleRow>

      <LocationRow>
        <LocationIcon />
        <LocationText>{location}</LocationText>
      </LocationRow>

      <Border />

      <StatusRow>
        <DateTimeRow>
          <DateTimeText>{`${date}  |  ${time}`}</DateTimeText>
        </DateTimeRow>
        <StatusText>{status}</StatusText>
      </StatusRow>
    </Container>
  );
}

JobCard.propTypes = {
  checked: PropTypes.bool,
  checkText: PropTypes.string,
  title: PropTypes.string,
  scope: PropTypes.string,
  location: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  status: PropTypes.string,
}

JobCard.defaultProps = {
  checked: true,
  checkText: 'exchange bin',
  title: 'Heathcote and Sons',
  scope: 'My Yard',
  location: 'LP 120 tanah Merah Coast Road',
  date: 'SAT, 22 - JAN - 2020',
  time: '9:00 AM',
  status: 'completed'
}

export default JobCard;
