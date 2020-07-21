import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  SVGS,
  COLORS,
  SIZE1,
} from 'src/constants';
import {
  popScreen,
  popToRootScreen,
} from 'src/navigation';
import {
  HeaderBar,
  ListWrap,
  ItemWrap,
  DefaultButton,
} from 'src/components';
import {
  Jobs,
  ViewStore,
} from 'src/redux';

import {
  Container,
  ShadowWrap,
  LoadingWrap,
  SearchBarWrap,
  SearchIconWrap,
  SearchInput,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
} from 'src/styles/header.styles';

import {
  ButtonWrap,
  DriverNoteItem,
  DriverNoteText,
} from './styled';

const { SearchIcon } = SVGS;

const FailJobScreen = ({
  focusedJob,
  driverNotes,
  pageOfdriverNotes,
  failJobs,
  getDriverNotes,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);
  const [ searchText, setSearchText ] = useState('');
  const [ selectedIndex, setSelectedIndex ] = useState(-1);

  const timerId = useRef(null);

  useEffect(() => {
    setReloading(true);

    getDriverNotes({
      search: searchText,
      success: () => setReloading(false),
      failure: () => setReloading(false),
    });
  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onFail = () => {
    if (selectedIndex === -1) {
      Alert.alert('Warning', 'Please select a driver note.');
      return;
    }

    setLoading(true);

    failJobs({
      jobIds: `${focusedJob.jobId}`,
      driverNote: driverNotes[selectedIndex].note,
      success: () => {
        setLoading(false);
        popToRootScreen(componentId);
      },
      failure: () => setLoading(false),
    });
  }

  const onEnd = () => {
    getDriverNotes({
      search: searchText,
      page: pageOfdriverNotes,
      success: () => {},
      failure: () => {},
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    getDriverNotes({
      search: searchText,
      success: () => setRefreshing(false),
      failure: () => setRefreshing(false),
    });
  };

  const onSearch = () => {
    Keyboard.dismiss();

    setReloading(true);
    setSelectedIndex(-1);

    getDriverNotes({
      search: searchText,
      success: () => setReloading(false),
      failure: () => setReloading(false),
    });
  };

  const onChangeSearchText = (text) => {
    setSearchText(text);

    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }

    timerId.current = setTimeout(() => {
      timerId.current = null;
      onSearch();
    }, 2500);
  };

  const onItemPress = (index) => {
    if (index === selectedIndex) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <ItemWrap
        activated={index === selectedIndex}
        deactivated
        activeColor={COLORS.RED1}
        onPress={() => onItemPress(index)}
        mTop={SIZE1 / 2}
        mBottom={SIZE1 / 2}
      >
        <DriverNoteItem>
          <DriverNoteText>{item.note}</DriverNoteText>
        </DriverNoteItem>
      </ItemWrap>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Fail Job</ScreenText>}
          leftIcon={<BackButton />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <SearchBarWrap>
        <SearchIconWrap>
          <SearchIcon />
        </SearchIconWrap>
        <SearchInput
          placeholder={'Search ...'}
          underlineColorAndroid={COLORS.TRANSPARENT1}
          returnKeyType={'go'}
          onSubmitEditing={onSearch}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={text => onChangeSearchText(text)}
          value={searchText}
        />
      </SearchBarWrap>

      {
        reloading
        ? <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        : <ListWrap
            data={driverNotes}
            keyExtractor={(item) => `${item.driverNoteId}`}
            renderItem={renderItem}
            onEndProcess={onEnd}
            onRefreshProcess={onRefresh}
            refreshing={refreshing}
          />
      }

      <ButtonWrap>
        <DefaultButton
          text={'Fail Job'}
          color={COLORS.RED1}
          onPress={onFail}
          loading={loading}
        />
      </ButtonWrap>
    </Container>
  );
};

FailJobScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  driverNotes: PropTypes.array.isRequired,
  pageOfdriverNotes: PropTypes.number.isRequired,
  failJobs: PropTypes.func.isRequired,
  getDriverNotes: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    driverNotes: ViewStore.selectors.getDriverNotes(state),
    pageOfdriverNotes: ViewStore.selectors.getPageOfDriverNotes(state),
  };
};

const mapDispatchToProps = {
  failJobs: Jobs.actionCreators.failJobs,
  getDriverNotes: ViewStore.actionCreators.getDriverNotes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FailJobScreen);
