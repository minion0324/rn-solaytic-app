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

const BinWrap = styled.View`
  width: ${SIZE20}px;
  height: ${SIZE4}px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.BLUE2};
  border-radius: ${SIZE1}px;
`;

const BinText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 500;
  color: ${COLORS.BLUE1};
`;

const TitleText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK1};
`;

const LocationRow = styled.View`
  flex-direction: row;
`;

const LocationText = styled.Text`
  font-size: ${FONT(12)}px;
  font-weight: 600;
  color: ${COLORS.GRAY3};
  margin-left: ${SIZE1}px;
`;

const JobCard = ({
  title,
  bin,
  location,
  time,
  status,
}) => {
  return (
    <Container>
      <Status />
      <Content>
        <TimeRow>
          <TimeText>{time}</TimeText>
          <BinWrap>
            <BinText>{bin}</BinText>
          </BinWrap>
        </TimeRow>
        <TitleText>{title}</TitleText>
        <LocationRow>
          <LocationIcon />
          <LocationText>{location}</LocationText>
        </LocationRow>
      </Content>
    </Container>
  );
}

JobCard.propTypes = {
  title: PropTypes.string,
  bin: PropTypes.string,
  location: PropTypes.string,
  time: PropTypes.string,
  status: PropTypes.string,
}

JobCard.defaultProps = {
  title: 'Heathcote and Sons',
  bin: 'exchange bin',
  location: 'LP 120 tanah Merah Coast Road',
  time: '9:00 AM',
  status: 'completed'
}

export default JobCard;
