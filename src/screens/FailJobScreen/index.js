import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE10,
  JOB_STATUS,
  COMPLETE_JOBS_KEY,
  BACKGROUND_FETCH_KEY,
} from 'src/constants';
import {
  showOverlay,
  dismissOverlay,
  popScreen,
  popToRootScreen,
  CUSTOM_MODAL_SCREEN,
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
  addItemToCache,
  removeItemFromCache,
  getCacheIds,
  getTimestamp,
} from 'src/utils';

import {
  Container,
  Content,
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
  ModalWrap,
  AlertText,
  AlertButtonRow,
  AlertButton,
  AlertButtonText,
} from 'src/styles/modal.styles';

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

  const [ isInBackgroundMode, setIsInBackgroundMode ] = useState(false);

  const [ searchText, setSearchText ] = useState('');

  const [ selectedIndex, setSelectedIndex ] = useState(-1);

  const timerId = useRef(null);

  useEffect(() => {
    checkIsInBackgroundMode();

    onReload();
  }, []);

  const checkIsInBackgroundMode = async () => {
    try {
      const { jobId } = focusedJob;

      const ids = await getCacheIds(BACKGROUND_FETCH_KEY);
      const index = ids.findIndex(id => id.jobId === jobId);
      if (index !== -1) {
        setIsInBackgroundMode(true);
        Toast.show('This job is in background mode.');
      }
    } catch (error) {
      //
    }
  };

  const onBack = () => {
    popScreen(componentId);
  };

  const onFailJobSuccess = async () => {
    try {
      const { jobId, jobNumber } = focusedJob;

      await removeItemFromCache(
        BACKGROUND_FETCH_KEY,
        { jobId, jobNumber },
      );

      await addItemToCache(
        COMPLETE_JOBS_KEY,
        { jobId, jobNumber },
        {
          timestamp: getTimestamp(),
          status: JOB_STATUS.FAILED,
        }
      );

      setLoading(false);
      popToRootScreen(componentId);
    } catch (error) {
      //
    }
  };

  const onFailJob = () => {
    setLoading(true);

    failJobs({
      jobIds: `${focusedJob.jobId}`,
      driverNote: driverNotes[selectedIndex].note,
      success: onFailJobSuccess,
      failure: () => setLoading(false),
    });
  }

  const onFail = () => {
    if (selectedIndex === -1) {
      Alert.alert('Warning', 'Please select a driver note.');
      return;
    }

    showOverlay(CUSTOM_MODAL_SCREEN, {
      width: '80%',
      offsetFromCenter: SIZE10,
      getContent: renderAlertModal,
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

  const onReload = () => {
    setReloading(true);

    getDriverNotes({
      search: searchText,
      success: () => setReloading(false),
      failure: () => setReloading(false),
    });
  };

  const onSearch = () => {
    Keyboard.dismiss();

    setSelectedIndex(-1);

    onReload();
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

  const renderAlertModal = (containerId) => {
    return (
      <ModalWrap>
        <AlertText>
          {
            isInBackgroundMode
            ? 'This job is in background mode. Are you sure?'
            : 'Fail this Job. Are you sure?'
          }
        </AlertText>
        <AlertButtonRow>
          <AlertButton onPress={() => dismissOverlay(containerId)}>
            <AlertButtonText>Cancel</AlertButtonText>
          </AlertButton>
          <AlertButton
            color={COLORS.RED1}
            onPress={() => {
              dismissOverlay(containerId);
              onFailJob();
            }}
          >
            <AlertButtonText color={COLORS.RED1}>Proceed</AlertButtonText>
          </AlertButton>
        </AlertButtonRow>
      </ModalWrap>
    );
  }

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

      <Content>
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

        <ListWrap
          data={driverNotes}
          keyExtractor={(item) => `${item.driverNoteId}`}
          renderItem={renderItem}
          onEndProcess={onEnd}
          onRefreshProcess={onRefresh}
          refreshing={refreshing}
        />

        {
          reloading &&
          <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        }

        <ButtonWrap>
          <DefaultButton
            text={'Fail Job'}
            color={COLORS.RED1}
            onPress={onFail}
            loading={loading}
          />
        </ButtonWrap>
      </Content>
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
