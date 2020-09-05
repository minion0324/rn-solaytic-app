import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  SVGS,
  COLORS,
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
  getItems,
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
      const allLogs = await getItems(COMPLETE_JOBS_KEY);

      console.log(allLogs);

      setJobLogs(allLogs);
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

  const renderItem = ({ item, index }) => {
    return null;
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
          keyExtractor={(item) => `${item.driverNoteId}`}
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
