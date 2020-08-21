import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Picker from 'react-native-picker';
import moment from 'moment';

import {
  SVGS,
  COLORS,
  SIZE2,
  FONT,
  APP_DATE_FORMAT,
} from 'src/constants';

const { ArrowDateIcon } = SVGS;

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
`;

const DateText = styled.Text`
  font-size: ${FONT(15)}px;
  font-weight: 600;
  color: ${COLORS.BLACK2};
  margin-horizontal: ${SIZE2}px;
`;

const DatePicker = ({
  date,
  onSelect,
}) => {
  const onPicker = () => {
    Picker.isPickerShow((status) => {
      if (status) {
        Picker.hide();
        return;
      }

      const pickerData = [-2, -1, 0, 1].map((index) => {
        const year = moment().add(index, 'years').format('YYYY');

        return {
          [year]: moment.months().map((month) => {
            return {
              [month]: Array(moment(`${year}-${month}`, 'YYYY-MMMM').daysInMonth())
                .fill(0)
                .map((e, i) => i < 9 ? `0${i + 1}` : `${i + 1}`)
            }
          })
        };
      });

      const selectedValue = [
        moment(date, APP_DATE_FORMAT).format('YYYY'),
        moment(date, APP_DATE_FORMAT).format('MMMM'),
        moment(date, APP_DATE_FORMAT).format( 'DD' ),
      ];

      Picker.init({
        pickerData: pickerData,
        selectedValue: selectedValue,
        pickerBg: [255, 255, 255, 1],
        pickerTitleText: 'Pick a Month',
        onPickerConfirm: ([year, month, day]) => {
          onSelect(`${day} ${moment(month, 'MMMM').format('MMM')} ${year}`);
        },
        onPickerCancel: () => {
          Picker.hide();
        },
      });

      Picker.show();
    });
  };

  return (
    <Container onPress={onPicker}>
      <DateText>{date}</DateText>
      <ArrowDateIcon />
    </Container>
  );
}

DatePicker.propTypes = {
  date: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DatePicker;
