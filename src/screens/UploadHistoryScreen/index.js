import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  SVGS,
  COLORS,
  SIZE1,
  JOB_STATUS,
  COMPLETE_JOBS_KEY,
} from 'src/constants';
import {
  popScreen,
} from 'src/navigation';
import {
  HeaderBar,
  ListWrap,
} from 'src/components';
import {
  ViewStore,
} from 'src/redux';
import {
  getCacheItems,
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
} from './styled';

const { SearchIcon } = SVGS;

const UploadHistoryScreen = ({
  setCoreScreenInfo,
  componentId,
}) => {
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

  const [ jobLogs, setJobLogs ] = useState([]);

  const [ searchText, setSearchText ] = useState('');

  const timerId = useRef(null);

  useEffect(() => {
    setCoreScreenInfo({
      componentId,
      componentType: 'push',
    });

    onReload();
  }, []);

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
        <FlexWrap flex={0.7}>
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
        <FlexWrap flex={0.3}>
          <ItemText
            numberOfLines={2}
            color={color}
          >
            {status}
          </ItemText>
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
  setCoreScreenInfo: ViewStore.actionCreators.setCoreScreenInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadHistoryScreen);
