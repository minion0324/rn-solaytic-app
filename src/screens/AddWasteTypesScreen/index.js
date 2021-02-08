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
  focusedJob,
  binIndex,
  binInfo,
  setBinInfo,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(true);
  const [ originWasteTypes, setOriginWasteTypes ] = useState([]);
  const [ searchedWasteTypes, setSearchedWasteTypes ] = useState([]);

  const [ searchText, setSearchText ] = useState('');

  const timerId = useRef(null);

  useEffect(() => {
    const { charges } = focusedJob;

    const data = charges.map(charge => charge['wasteType']);

    setOriginWasteTypes(data);
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
  }, [searchText, originWasteTypes]);

  const getSearchedWasteTypes = (newWasteTypes) => {
    if (!searchText) {
      setSearchedWasteTypes(newWasteTypes || originWasteTypes);
      return;
    }

    const searched = (newWasteTypes || originWasteTypes).map((item) => {
      if (
        item.wasteTypeName
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ) {
        return item;
      } else {
        return { ...item, notShow: true };
      }
    });

    setSearchedWasteTypes(searched);
  };

  const onClose = () => {
    popScreen(componentId);
  };

  const onCheck = () => {
    popScreen(componentId);
  };

  const onSearch = () => {
    Keyboard.dismiss();
    getSearchedWasteTypes();
    setLoading(false);
  };

  const onChangeSearchText = (text) => {
    setSearchText(text);
  };

  const onUpdateOriginWasteTypes = (index, newItem) => {
    const newWasteTypes = originWasteTypes.slice(0);
    newWasteTypes.splice(index, 1, newItem);

    setOriginWasteTypes(newWasteTypes);
    getSearchedWasteTypes(newWasteTypes);
  };

  const renderItem = ({ item, index }) => {
    if (item.notShow) {
      return null;
    }

    return (
      <ItemWrap
        deactivated
        onPress={() => {
          onUpdateOriginWasteTypes(index, {
            ...item,
            isSelected: !item.isSelected,
          });
        }}
        mLeft={SIZE2} mTop={0.5}
        mRight={SIZE2} mBottom={0.5}
      >
        <WasteTypeItem>
          <FlexWrap flex={2}>
            <RowWrap>
              {
                item.isSelected
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
          data={searchedWasteTypes}
          keyExtractor={(item) => `${item.wasteTypeId}`}
          renderItem={renderItem}
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
    focusedJob: Jobs.selectors.getFocusedJob(state),
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddWasteTypesScreen);
