import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Jobs,
  ViewStore,
} from 'src/redux';
import {
  HeaderBar,
  ListWrap,
  ItemWrap,
} from 'src/components';
import {
  popScreen,
} from 'src/navigation';
import {
  SVGS,
  COLORS,
  SIZE2,
} from 'src/constants';

import {
  Container,
  Content,
  ShadowWrap,
  LoadingWrap,
  SearchBarWrap,
  SearchIconWrap,
  SearchInput,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  Close,
  Check,
} from 'src/styles/header.styles';

import {
  WasteTypeItem,
  WasteTypeText,
} from './styled';

const {
  SearchIcon,
  BlueActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
} = SVGS;

const AddWasteTypesScreen = ({
  wasteTypes,
  pageOfWasteTypes,
  getWasteTypes,
  binIndex,
  binInfo,
  setBinInfo,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(true);
  const [ refreshing, setRefreshing ] = useState(false);

  const [ searchText, setSearchText ] = useState('');

  const [ selectedWasteTypes, setSelectedWasteTypes ] = useState([]);

  const timerId = useRef(null);

  useEffect(() => {
    //
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

  const onClose = () => {
    popScreen(componentId);
  };

  const onCheck = () => {
    onClose();
  };

  const onEnd = () => {
    getWasteTypes({
      search: searchText,
      page: pageOfWasteTypes,
      success: () => {},
      failure: () => {},
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    getWasteTypes({
      search: searchText,
      success: () => setRefreshing(false),
      failure: () => setRefreshing(false),
    });
  };

  const onReload = () => {
    setLoading(true);

    getWasteTypes({
      search: searchText,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onSearch = () => {
    Keyboard.dismiss();
    onReload();
  };

  const onPressItem = (item) => {
    const newSelectedWasteTypes = selectedWasteTypes.slice(0);

    const index = selectedWasteTypes.findIndex((el) => (
      el.wasteTypeId === item.wasteTypeId
    ));

    if (index === -1) {
      newSelectedWasteTypes.push(item);
    } else {
      newSelectedWasteTypes.splice(index, 1);
    }

    setSelectedWasteTypes(newSelectedWasteTypes);
  };

  const onChangeSearchText = (text) => {
    setSearchText(text);
  };

  const renderItem = ({ item }) => {
    const index = selectedWasteTypes.findIndex((el) => (
      el.wasteTypeId === item.wasteTypeId
    ));

    return (
      <ItemWrap
        deactivated
        onPress={() => onPressItem(item)}
        mLeft={SIZE2} mTop={0.5}
        mRight={SIZE2} mBottom={0.5}
      >
        <WasteTypeItem>
          <FlexWrap flex={2}>
            <RowWrap>
              {
                index !== -1
                ? <BlueActiveCircleCheckIcon />
                : <DeactiveCircleCheckIcon />
              }
              <SpaceView mLeft={SIZE2} />
              <WasteTypeText numberOfLines={1}>
                {item.wasteTypeName}
              </WasteTypeText>
            </RowWrap>
          </FlexWrap>
        </WasteTypeItem>
      </ItemWrap>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <ScreenText>Add waste types</ScreenText>
          }
          leftIcon={<Close />}
          rightIcon={<Check />}
          onPressLeft={onClose}
          onPressRight={onCheck}
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
          data={wasteTypes}
          keyExtractor={(item) => `${item.wasteTypeId}`}
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

AddWasteTypesScreen.propTypes = {
  wasteTypes: PropTypes.array.isRequired,
  pageOfWasteTypes: PropTypes.number.isRequired,
  getWasteTypes: PropTypes.func.isRequired,
  binIndex: PropTypes.number.isRequired,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

AddWasteTypesScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    wasteTypes: ViewStore.selectors.getWasteTypes(state),
    pageOfWasteTypes: ViewStore.selectors.getPageOfWasteTypes(state),
  };
};

const mapDispatchToProps = {
  getWasteTypes: ViewStore.actionCreators.getWasteTypes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddWasteTypesScreen);
