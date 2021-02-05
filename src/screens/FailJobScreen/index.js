import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
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
  showLightBox,
  dismissLightBox,
  popScreen,
  popToRootScreen,
  CUSTOM_MODAL_SCREEN,
} from 'src/navigation';
import {
  HeaderBar,
  ListWrap,
  ItemWrap,
} from 'src/components';
import {
  Jobs,
  ViewStore,
} from 'src/redux';
import {
  getTimestamp,
  addItemToCache,
  removeItemFromCache,
  getCacheIds,
} from 'src/utils';

import {
  Container,
  Content,
  ShadowWrap,
  LoadingWrap,
  SearchBarWrap,
  SearchIconWrap,
  SearchInput,
  RowWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  Back,
} from 'src/styles/header.styles';
import {
  ModalWrap,
  AlertText,
  AlertButtonRow,
  AlertButton,
  AlertButtonText,
} from 'src/styles/modal.styles';

import {
  DriverNoteItem,
  DriverNoteText,
} from './styled';

const {
  FailIcon,
  SearchIcon,
} = SVGS;

const FailJobScreen = ({
  focusedJob,
  driverNotes,
  pageOfDriverNotes,
  failJobs,
  getDriverNotes,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(true);
  const [ refreshing, setRefreshing ] = useState(false);

  const [ isInBackgroundMode, setIsInBackgroundMode ] = useState(false);

  const [ searchText, setSearchText ] = useState('');

  const [ selectedIndex, setSelectedIndex ] = useState(-1);

  const timerId = useRef(null);

  useEffect(() => {
    checkIsInBackgroundMode();
  }, []);

  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }

    timerId.current = setTimeout(() => {
      timerId.current = null;
      onSearch();
    }, 1500);
  }, [searchText]);

  useEffect(() => {
    if (selectedIndex !== -1) {
      showLightBox(CUSTOM_MODAL_SCREEN, {
        width: '80%',
        offsetFromCenter: SIZE10,
        getContent: renderAlertModal,
      });
    }
  }, [selectedIndex]);

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
    Keyboard.dismiss();
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

  const onFailJobFailure = () => {
    setLoading(false);
    setSelectedIndex(-1);
  };

  const onFailJob = () => {
    setLoading(true);

    failJobs({
      jobIds: `${focusedJob.jobId}`,
      driverNote: driverNotes[selectedIndex].note,
      success: onFailJobSuccess,
      failure: onFailJobFailure,
    });
  };

  const onEnd = () => {
    getDriverNotes({
      search: searchText,
      page: pageOfDriverNotes,
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
    setLoading(true);

    getDriverNotes({
      search: searchText,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onSearch = () => {
    Keyboard.dismiss();
    setSelectedIndex(-1);
    onReload();
  };

  const onChangeSearchText = (text) => {
    setSearchText(text);
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
          <AlertButton
            onPress={() => {
              dismissLightBox(containerId);
              onFailJobFailure();
            }}
          >
            <AlertButtonText>Cancel</AlertButtonText>
          </AlertButton>
          <AlertButton
            color={COLORS.RED1}
            onPress={() => {
              dismissLightBox(containerId);
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
        deactivated
        onPress={() => setSelectedIndex(index)}
        mLeft={SIZE1} mTop={SIZE1 / 2}
        mRight={SIZE1} mBottom={SIZE1 / 2}
      >
        <DriverNoteItem
          activated={index === selectedIndex}
        >
          <DriverNoteText
            activated={index === selectedIndex}
          >
            {item.note}
          </DriverNoteText>
        </DriverNoteItem>
      </ItemWrap>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <RowWrap>
              <FailIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText>Fail Job</ScreenText>
            </RowWrap>
          }
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <SearchBarWrap>
        <SearchIconWrap>
          <SearchIcon />
        </SearchIconWrap>
        <SearchInput
          placeholder={'Search'}
          placeholderTextColor={COLORS.GRAY3}
          underlineColorAndroid={COLORS.TRANSPARENT1}
          returnKeyType={'go'}
          onSubmitEditing={onSearch}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={text => onChangeSearchText(text)}
          value={searchText}
        />
      </SearchBarWrap>

      <Content>
        <ListWrap
          data={driverNotes}
          keyExtractor={(item) => `${item.driverNoteId}`}
          renderItem={renderItem}
          onEndProcess={onEnd}
          onRefreshProcess={onRefresh}
          refreshing={refreshing}
        />

        {
          loading &&
          <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        }
      </Content>
    </Container>
  );
};

FailJobScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  driverNotes: PropTypes.array.isRequired,
  pageOfDriverNotes: PropTypes.number.isRequired,
  failJobs: PropTypes.func.isRequired,
  getDriverNotes: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    driverNotes: ViewStore.selectors.getDriverNotes(state),
    pageOfDriverNotes: ViewStore.selectors.getPageOfDriverNotes(state),
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
