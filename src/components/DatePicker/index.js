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
  DATE_FORMAT,
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
      } else {
        Picker.init({
          pickerData: moment.months(),
          selectedValue: [moment(date, DATE_FORMAT).format('MMMM')],
          pickerBg: [255, 255, 255, 1],
          pickerTitleText: 'Pick a Month',
          onPickerConfirm: (data) => {
            const month = moment(data[0], 'MMMM').format('MMM');
            const year = moment(date, DATE_FORMAT).format('YYYY');
            onSelect(`${month} ${year}`);
          },
          onPickerCancel: () => {
            Picker.hide();
          },
        });

        Picker.show();
      }
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
