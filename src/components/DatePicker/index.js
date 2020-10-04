import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Calendar } from 'react-native-calendars';

import {
  COLORS,
  WIDTH,
  DEFAULT_DATE_FORMAT,
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
  jobDates,
  onSelect,
}) => {
  const markedDates = useMemo(() => {
    const result = jobDates.reduce((res, item) => {
      const mid = getDate(item, DEFAULT_DATE_FORMAT);

      return {
        ...res,
        [mid]: { marked: true },
      };
    }, {});

    return result;
  }, [jobDates]);

  const selectedDate = useMemo(() => {
    const mid = getStartDate(date, DATE_KEY);

    return {
      [mid]: {
        selected: true,
        selectedColor: COLORS.BLUE1,
      },
    };
  }, [date]);

  const onDateSelect = (day) => {
    onSelect(getDate(day.dateString));
  };

  return (
    <Container>
      <Calendar
        onDayPress={onDateSelect}
        onDayLongPress={onDateSelect}
        monthFormat={'MMMM yyyy'}
        markedDates={{
          ...markedDates,
          ...selectedDate,
        }}
      />
    </Container>
  );
};

DatePicker.propTypes = {
  date: PropTypes.string.isRequired,
  jobDates: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DatePicker;
