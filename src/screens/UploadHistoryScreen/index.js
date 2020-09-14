import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
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
  LoadingWrap,
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
  RetryButton,
} from './styled';

const { SearchIcon, RetryIcon } = SVGS;

const UploadHistoryScreen = ({
  completeJobs,
  setCoreScreenInfo,
  componentId,
}) => {
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

  const [ jobLogs, setJobLogs ] = useState([]);

  const [ searchText, setSearchText ] = useState('');

  const timerId = useRef(null);

  useEffect(() => {
    onReload();
  }, []);

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
      const allLogs = await getCacheItems(COMPLETE_JOBS_KEY);

      setJobLogs(allLogs.reverse());
    } catch (error) {
      //
    }
  };

  const onBack = () => {
    popScreen(componentId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getJobLogs();
    setRefreshing(false);
  };

  const onReload = async () => {
    setReloading(true);
    await getJobLogs();
    setReloading(false);
  };

  const onSearch = () => {
    Keyboard.dismiss();

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

  const onRetrySuccess = async (id) => {
    try {
      await removeItemFromCache(BACKGROUND_FETCH_KEY, id);

      await addItemToCache(COMPLETE_JOBS_KEY, id, {
        timestamp: getTimestamp(),
        status: JOB_STATUS.COMPLETED,
      });

      onRefresh();
    } catch (error) {
      //
    }
  };

  const onRetry = async (item) => {
    try {
      const {
        value: { fetchData },
      } = await getCacheItemById(BACKGROUND_FETCH_KEY, item.id);

      const [ jobIds, stepBinUpdate, attempt ] = fetchData;

      completeJobs({
        jobIds,
        stepBinUpdate,
        attempt,
        success: () => onRetrySuccess(item.id),
        failure: () => {},
      });
    } catch (error) {
      Alert.alert('Warning', 'Something went wrong.');
    }
  };

  const renderItem = ({ item }) => {
    const {
      id: { jobNumber },
      value: { status, timestamp },
    } = item;

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
              <RetryButton onPress={() => onRetry(item)}>
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
          data={jobLogs}
          keyExtractor={(item) => `${item.id.jobId}`}
          renderItem={renderItem}
          onRefreshProcess={onRefresh}
          refreshing={refreshing}
        />

        {
          reloading &&
          <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        }
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
