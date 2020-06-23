import React from 'react';
import PropTypes from 'prop-types';

import {
  HeaderBar,
  BottomBar,
  JobCard,
  ListWrap,
  ItemWrap,
  DefaultButton,
} from 'src/components';
import {
  SVGS,
  COLORS,
} from 'src/constants';

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

const AlertScreen = ({ componentId }) => {
  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          leftIcon={<SideMenuIcon />}
          rightIcon={<HelloText>Hello, William Tan</HelloText>}
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
        data={['job1', 'job2', 'job3', 'job4', 'job5',]}
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
  componentId: PropTypes.string.isRequired,
};

export default AlertScreen;
