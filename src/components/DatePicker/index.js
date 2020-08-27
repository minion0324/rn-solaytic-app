import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Calendar } from 'react-native-calendars';

import {
  COLORS,
  WIDTH,
  DATE_KEY,
} from 'src/constants';
import {
  getDate,
  getStartDate,
} from 'src/utils';

const Container = styled.View`
  height: ${WIDTH * 0.9}px;
  background-color: ${COLORS.WHITE1};
`;

const DatePicker = ({
  date,
  onSelect,
}) => {
  const getSelectedDate = () => {
    const selectedDate = getStartDate(date, DATE_KEY);

    return {
      [selectedDate]: {
        selected: true,
        selectedColor: COLORS.BLUE1,
      },
    };
  }

  const onDateSelect = (day) => {
    onSelect(getDate(day.dateString));
  };

  return (
    <Container>
      <Calendar
        onDayPress={onDateSelect}
        onDayLongPress={onDateSelect}
        monthFormat={'MMMM yyyy'}
        markedDates={getSelectedDate()}
      />
    </Container>
  );
};

DatePicker.propTypes = {
  date: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DatePicker;
