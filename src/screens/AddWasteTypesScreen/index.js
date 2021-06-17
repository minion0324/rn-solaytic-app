import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ViewStore,
  Jobs
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
  WasteTypeGreyText
} from './styled';

const {
  SearchIcon,
  BlueActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
} = SVGS;

const AddWasteTypesScreen = ({
  focusedJob,
  wasteTypes,
  pageOfWasteTypes,
  getWasteTypes,
  binIndex,
  binInOutIndex,
  binInfo,
  setBinInfo,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(true);
  const [ refreshing, setRefreshing ] = useState(false);

  const [ searchText, setSearchText ] = useState('');

  const [ selectedWasteTypes, setSelectedWasteTypes ] = useState([]);

  const timerId = useRef(null);
  const customerSiteId = focusedJob.steps[0].customerSiteId;
  const binTypeId = focusedJob.steps[0].binTypeId;

  useEffect(() => {
    setSelectedWasteTypes(
      binInfo[binIndex].wasteTypes,
    );
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

  const onUpdateBinInfo = (newInfo) => {
    const newBinInfo = binInfo.slice(0);

    newBinInfo[binIndex] = {
      ...newBinInfo[binIndex],
      ...newInfo,
    };

    setBinInfo(newBinInfo);
  };

  const onClose = () => {
    Keyboard.dismiss();
    popScreen(componentId);
  };

  const onCheck = () => {
    onUpdateBinInfo({ wasteTypes: selectedWasteTypes });
    onClose();
  };

  const onEnd = () => {
    getWasteTypes({
      search: searchText,
      page: pageOfWasteTypes,
      customerSiteId: customerSiteId,
      binTypeId: binTypeId,
      success: () => {},
      failure: () => {},
    });
  };

  const onRefresh = () => {
    setRefreshing(true);

    getWasteTypes({
      search: searchText,
      customerSiteId: customerSiteId,
      binTypeId: binTypeId,
      success: () => setRefreshing(false),
      failure: () => setRefreshing(false),
    });
  };

  const onReload = () => {
    setLoading(true);

    getWasteTypes({
      search: searchText,
      customerSiteId: customerSiteId,
      binTypeId: binTypeId,
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
      if (
        binInOutIndex === 1 &&
        selectedWasteTypes.length > 0
      ) {
        Alert.alert('Warning', 'You can select only 1 for waste type');
        return;
      }

      newSelectedWasteTypes.push({
        jobStepId: binInfo[binIndex].jobStepId,
        wasteType: item,
        wasteTypeId: item.wasteTypeId,
      });
    } else {
      newSelectedWasteTypes.splice(index, 1);
    }

    setSelectedWasteTypes(newSelectedWasteTypes);
  };

  const onChangeSearchText = (text) => {
    setSearchText(text);
  };

  const renderItem = ({ item, index }) => {
    const idx = selectedWasteTypes.findIndex((el) => (
      el.wasteTypeId === item.wasteTypeId
    ));

    if (
      idx !== -1 &&
      index >= selectedWasteTypes.length
    ) {
      return null;
    }

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
                idx !== -1
                ? <BlueActiveCircleCheckIcon />
                : <DeactiveCircleCheckIcon />
              }
              <SpaceView mLeft={SIZE2} />
              {
                item.haveRate ? 
                <WasteTypeText numberOfLines={1}>
                  {item.wasteTypeName}
                </WasteTypeText>
                :
                <WasteTypeGreyText numberOfLines={1}>
                  {item.wasteTypeName}
                </WasteTypeGreyText>
              }
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
          data={
            selectedWasteTypes.map(item => item.wasteType)
              .concat(wasteTypes)
          }
          keyExtractor={(item, index) => (
            `${item.wasteTypeId}` +
            `${index < selectedWasteTypes.length ? '_selected' : ''}`
          )}
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
  focusedJob: PropTypes.object.isRequired,
  wasteTypes: PropTypes.array.isRequired,
  pageOfWasteTypes: PropTypes.number.isRequired,
  getWasteTypes: PropTypes.func.isRequired,
  binIndex: PropTypes.number.isRequired,
  binInOutIndex: PropTypes.number.isRequired,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

AddWasteTypesScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
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
