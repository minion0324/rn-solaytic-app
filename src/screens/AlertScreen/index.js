import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  HeaderBar,
  BottomBar,
  JobCard,
  ListWrap,
  ItemWrap,
  DefaultButton,
  DatePicker,
} from 'src/components';
import {
  SVGS,
  COLORS,
  DATE_FORMAT,
} from 'src/constants';
import { User } from 'src/redux';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';
import {
  HelloText,
} from 'src/styles/header.styles';
import {
  CardRow,
  DateWrap,
  DateText1,
  DateText2,
} from 'src/styles/card.styles';

import {
  ButtonWrap,
} from './styled';

const { SideMenuIcon } = SVGS;

const AlertScreen = ({
  driverName,
  componentId,
}) => {
  const [ date, setDate ] = useState(moment().format(DATE_FORMAT));

  const onDateSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          leftIcon={<SideMenuIcon />}
          centerIcon={
            <DatePicker date={date} onSelect={onDateSelect} />
          }
          rightIcon={<HelloText>{`Hello ${driverName}`}</HelloText>}
        />
        <ButtonWrap>
          <DefaultButton
            text={'Acknowledge'}
            color={COLORS.BLUE1}
            mTop={-8}
          />
        </ButtonWrap>
      </ShadowWrap>

      <ListWrap
        data={[]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CardRow>
            <DateWrap>
              <DateText1>15</DateText1>
              <DateText2>Mon</DateText2>
            </DateWrap>
            <ItemWrap>
              <JobCard />
            </ItemWrap>
          </CardRow>
        )}
      />

      <BottomBar componentId={componentId} activeIndex={0} />
    </Container>
  );
};

AlertScreen.propTypes = {
  driverName: PropTypes.string.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    driverName: User.selectors.getDriverName(state),
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlertScreen);
