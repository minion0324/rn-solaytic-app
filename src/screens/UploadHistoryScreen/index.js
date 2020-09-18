import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActivityIndicator, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';

import {
  SVGS,
  COLORS,
  SIZE1,
  JOB_STATUS,
  COMPLETE_JOBS_KEY,
  BACKGROUND_FETCH_KEY,
} from 'src/constants';
import {
  popScreen,
} from 'src/navigation';
import {
  HeaderBar,
  ListWrap,
} from 'src/components';
import {
  Jobs,
  ViewStore,
} from 'src/redux';
import {
  addItemToCache,
  removeItemFromCache,
  getCacheItemById,
  getCacheItems,
  getTimestamp,
} from 'src/utils';

import {
  Container,
  Content,
  ShadowWrap,
  SearchBarWrap,
  SearchIconWrap,
  SearchInput,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
} from 'src/styles/header.styles';

import {
  Item,
  ItemText,
  StatusWrap,
  RetryWrap,
  RetryButton,
} from './styled';

const { SearchIcon, RetryIcon } = SVGS;

const UploadHistoryScreen = ({
  completeJobs,
  setCoreScreenInfo,
  componentId,
}) => {
  const [ refreshing, setRefreshing ] = useState(false);

  const [ jobLogs, setJobLogs ] = useState([]);
  const [ searchedJobLogs, setSearchedJobLogs ] = useState([]);

  const [ searchText, setSearchText ] = useState('');

  const timerId = useRef(null);

  useEffect(() => {
    getJobLogs();
  }, []);

  useEffect(() => {
    getSearchedJobLogs();
  }, [jobLogs]);

  const hasRetryJobs = useCallback(
    () => {
      const index = jobLogs.findIndex(item => item.loading);

      return (index !== -1);
    },
    [jobLogs],
  );

  useNavigationComponentDidAppear((event) => {
    const { componentName } = event;

    setCoreScreenInfo({
      componentId,
      componentName,
      componentType: 'push',
    });
  });

  const getJobLogs = async () => {
    try {
      if (hasRetryJobs()) {
        return;
      }

      const allLogs = await getCacheItems(COMPLETE_JOBS_KEY);

      if (allLogs.length > 0) {
        setJobLogs(allLogs);
      }
    } catch (error) {
      //
    }
  };

  const getSearchedJobLogs = () => {
    const searchedLogs = jobLogs.map((item) => {
      const {
        value: { status },
        id: { jobNumber },
      } = item;

      if (
        status.toLowerCase().includes(searchText.toLowerCase()) ||
        jobNumber.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return item;
      } else {
        return { ...item, notShow: true };
      }
    });

    setSearchedJobLogs(searchedLogs);
  };

  const onBack = () => {
    Keyboard.dismiss();
    popScreen(componentId);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await getJobLogs();

    setRefreshing(false);
  };

  const onSearch = () => {
    Keyboard.dismiss();

    getSearchedJobLogs();
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

  const updateJobLogs = (index, id, value, loading) => {
    const newJobLogs = jobLogs.slice(0);
    newJobLogs[index] = { id, value, loading };
    setJobLogs(newJobLogs);
  };

  const onRetrySuccess = async (item, index) => {
    try {
      const { id } = item;

      await removeItemFromCache(BACKGROUND_FETCH_KEY, id);

      const value = {
        timestamp: getTimestamp(),
        status: JOB_STATUS.COMPLETED,
      };

      await addItemToCache(COMPLETE_JOBS_KEY, id, value);

      Toast.show('This job is completed.');

      updateJobLogs(index, id, value, false);
    } catch (error) {
      onRetryFailure(item, index);
    }
  };

  const onRetryFailure = (item, index) => {
    Alert.alert('Warning', 'Something went wrong.');

    updateJobLogs(index, item.id, item.value, false);
  }

  const onRetry = async (item, index) => {
    try {
      updateJobLogs(index, item.id, item.value, true);

      const {
        value: { fetchData },
      } = await getCacheItemById(BACKGROUND_FETCH_KEY, item.id);

      const [ jobIds, stepBinUpdate, pricings, attempt ] = fetchData;

      completeJobs({
        jobIds,
        stepBinUpdate,
        pricings,
        attempt,
        success: () => onRetrySuccess(item, index),
        failure: () => onRetryFailure(item, index),
      });
    } catch (error) {
      onRetryFailure(item, index);
    }
  };

  const renderItem = ({ item, index }) => {
    const {
      id: { jobNumber },
      value: { status, timestamp },
      loading,
      notShow,
    } = item;

    if (notShow) {
      return null;
    }

    const color = status === JOB_STATUS.COMPLETED
      ? COLORS.GREEN1
      : status === JOB_STATUS.FAILED
        ? COLORS.RED1
        : COLORS.BLACK2;

    return (
      <Item>
        <FlexWrap flex={5}>
          <ItemText numberOfLines={1}>
            {
              'Uploaded: ' +
              moment(timestamp, 'x').format('DD-MMM-YY hh:mm A')
            }
          </ItemText>
          <SpaceView mTop={SIZE1} />
          <ItemText numberOfLines={1}>
            {jobNumber}
          </ItemText>
        </FlexWrap>
        <FlexWrap flex={4}>
          <StatusWrap>
            <ItemText numberOfLines={2} color={color}>
              {status}
            </ItemText>
            {
              status !== JOB_STATUS.FAILED &&
              status !== JOB_STATUS.COMPLETED &&
              <RetryWrap>
                {
                  loading
                  ? <ActivityIndicator
                      size={'small'}
                      color={COLORS.GRAY3}
                    />
                  : <RetryButton
                      onPress={() => onRetry(item, index)}
                      disabled={hasRetryJobs()}
                    >
                      <RetryIcon />
                      <SpaceView mLeft={SIZE1} />
                      <ItemText
                        numberOfLines={1}
                        color={COLORS.GRAY3}
                      >
                        Retry
                      </ItemText>
                    </RetryButton>
                }
              </RetryWrap>
            }
          </StatusWrap>
        </FlexWrap>
      </Item>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>History</ScreenText>}
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
          data={searchedJobLogs}
          keyExtractor={(item) => `${item.id.jobId}`}
          renderItem={renderItem}
          onRefreshProcess={onRefresh}
          refreshing={refreshing}
        />
      </Content>
    </Container>
  );
};

UploadHistoryScreen.propTypes = {
  completeJobs: PropTypes.func.isRequired,
  setCoreScreenInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

UploadHistoryScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    //
  };
};

const mapDispatchToProps = {
  completeJobs: Jobs.actionCreators.completeJobs,
  setCoreScreenInfo: ViewStore.actionCreators.setCoreScreenInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadHistoryScreen);
