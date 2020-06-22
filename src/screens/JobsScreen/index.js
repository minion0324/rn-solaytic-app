import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  HeaderBar,
  BottomBar,
  JobCard,
  ListWrap,
  ItemWrap,
} from 'src/components';
import {
  SVGS,
  COLORS,
} from 'src/constants';
import {
  showModal,
  JOB_DETAILS_SCREEN,
} from 'src/navigation';

import {
  Container,
  ShadowWrap,
} from 'src/styles/common.styles';

import {
  Wrap,
  Tab,
} from './styled';

const { SideMenuIcon } = SVGS;

const JobsScreen = ({ componentId }) => {
  const [ index, setIndex ] = useState(0);
  const [ tabs ] = useState([
    { key: 'first', color: COLORS.GRAY2 },
    { key: 'second', color: COLORS.BLUE1 },
    { key: 'third', color: COLORS.GREEN1 },
    { key: 'fourth', color: COLORS.RED1 },
  ]);

  const toJobDetails = () => {
    showModal(JOB_DETAILS_SCREEN);
  }

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          leftIcon={<SideMenuIcon />}
        />
        <Wrap>
          {
            tabs.map((item) => (
              <Tab
                key={item.key}
                color={item.color}
              />
            ))
          }
        </Wrap>
      </ShadowWrap>

      <ListWrap
        data={['job1', 'job2', 'job3', 'job4', 'job5',]}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <ItemWrap
            onPress={toJobDetails}
          >
            <JobCard />
          </ItemWrap>
        )}
      />

      <BottomBar componentId={componentId} activeIndex={1} />
    </Container>
  );
};

JobsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default JobsScreen;
