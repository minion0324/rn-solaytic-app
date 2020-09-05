import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';

import {
  SVGS,
  COLORS,
} from 'src/constants';
import {
  popScreen,
} from 'src/navigation';
import {
  HeaderBar,
} from 'src/components';

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
  componentId,
}) => {
  const [ reloading, setReloading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

  const [ searchText, setSearchText ] = useState('');

  const timerId = useRef(null);

  const onBack = () => {
    popScreen(componentId);
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

  const onSearch = () => {
    Keyboard.dismiss();

    setReloading(true);
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
      </Content>
    </Container>
  );
};

UploadHistoryScreen.propTypes = {
  componentId: PropTypes.string.isRequired,
};

UploadHistoryScreen.defaultProps = {
  //
};

export default UploadHistoryScreen;
