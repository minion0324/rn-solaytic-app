import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TabView, TabBar } from 'react-native-tab-view';

import {
  Header,
  JobCard,
  ListContainer,
  ListItemWrap,
} from 'src/components';
import {
  SVGS,
  WIDTH,
  HEIGHT,
} from 'src/constants';

import {
  Container,
} from 'src/styles/common.styles';
import {
  TabBarStyle,
  TabBarIndicatorStyle,
  TabBarLabelStyle,
  TabBarTabStyle,
  TabBarActiveColor,
  TabBarInactiveColor,
} from 'src/styles/tab.styles';

const { SideMenuIcon, SearchIcon } = SVGS;

const JobsScreen = ({ componentId }) => {
  const [ index, setIndex ] = useState(0);
  const [ routes ] = useState([
    { key: 'first', title: 'All Jobs (2)' },
    { key: 'second', title: 'In Progress (1)' },
    { key: 'third', title: 'Completed (0)' },
    { key: 'fourth', title: 'Cancelled (1)' },
  ]);

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        getLabelText={({ route }) => route.title}
        style={TabBarStyle}
        indicatorStyle={TabBarIndicatorStyle}
        labelStyle={TabBarLabelStyle}
        tabStyle={TabBarTabStyle}
        activeColor={TabBarActiveColor}
        inactiveColor={TabBarInactiveColor}
        scrollEnabled={true}
      />
    );
  };

  const renderScene = ({ route }) => {
    return (
      <ListContainer
        data={['job1', 'job2', 'job3', 'job4', 'job5',]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListItemWrap>
            <JobCard />
          </ListItemWrap>
        )}
      />
    );
  };

  return (
    <Container>
      <Header
        leftIcon={<SideMenuIcon />}
        rightIcon={<SearchIcon />}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={idx => setIndex(idx)}
        initialLayout={{
          width: WIDTH,
          height: HEIGHT,
        }}
        swipeEnabled
        useNativeDriver
      />
    </Container>
  );
};

JobsScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default JobsScreen;
