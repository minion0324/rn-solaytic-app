import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigationComponentDidDisappear } from 'react-native-navigation-hooks';

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
  SIZE1,
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
  EmptyWrap,
  Back,
} from 'src/styles/header.styles';

import {
  ServiceItem,
  ServiceText,
  IconButton,
  QuantityWrap,
} from './styled';

const {
  SearchIcon,
  ServiceIcon,
  ActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
  AddCircleIcon,
  RemoveCircleIcon,
} = SVGS;

const AddServicesScreen = ({
  services,
  setServices,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(true);
  const [ originServices, setOriginServices ] = useState([]);
  const [ searchedServices, setSearchedServices ] = useState([]);

  const [ searchText, setSearchText ] = useState('');

  const timerId = useRef(null);

  useEffect(() => {
    setOriginServices(services);
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
  }, [searchText, originServices]);

  useNavigationComponentDidDisappear(() => {
    setServices(originServices);
  });

  const getSearchedServices = (newServices) => {
    if (!searchText) {
      setSearchedServices(newServices || originServices);
      return;
    }

    const searched = (newServices || originServices).map((item) => {
      if (
        item.serviceAdditionalChargeName
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ) {
        return item;
      } else {
        return { ...item, notShow: true };
      }
    });

    setSearchedServices(searched);
  };

  const onBack = () => {
    popScreen(componentId);
  };

  const onSearch = () => {
    Keyboard.dismiss();
    getSearchedServices();
    setLoading(false);
  };

  const onChangeSearchText = (text) => {
    setSearchText(text);
  };

  const onUpdateOriginService = (index, newItem) => {
    const newServices = originServices.slice(0);
    newServices.splice(index, 1, newItem);

    setOriginServices(newServices);
    getSearchedServices(newServices);
  };

  const renderItem = ({ item, index }) => {
    if (item.notShow) {
      return null;
    }

    return (
      <ItemWrap
        deactivated
        onPress={() => {
          onUpdateOriginService(index, {
            ...item,
            isSelected: !item.isSelected,
          });
        }}
        mLeft={SIZE1} mTop={0.5}
        mRight={SIZE1} mBottom={0.5}
      >
        <ServiceItem>
          <FlexWrap flex={2}>
            <RowWrap>
              {
                item.isSelected
                ? <ActiveCircleCheckIcon />
                : <DeactiveCircleCheckIcon />
              }
              <SpaceView mLeft={SIZE2} />
              <ServiceText numberOfLines={1}>
                {item.serviceAdditionalChargeName}
              </ServiceText>
            </RowWrap>
          </FlexWrap>
          {
            item.isSelected &&
            <FlexWrap flex={1}>
              <RowWrap>
                <IconButton
                  onPress={() => {
                    onUpdateOriginService(index, {
                      ...item,
                      quantity: +(item.quantity || 1) + 1,
                    });
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
                <QuantityWrap>
                  <ServiceText>
                    {item.quantity || 1}
                  </ServiceText>
                </QuantityWrap>
                <IconButton
                  onPress={() => {
                    onUpdateOriginService(index, {
                      ...item,
                      quantity: +(item.quantity || 1) - 1,
                    });
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </RowWrap>
            </FlexWrap>
          }
        </ServiceItem>
      </ItemWrap>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <RowWrap>
              <ServiceIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText>Add Services</ScreenText>
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
          placeholder={'Search ...'}
          placeholderTextColor={COLORS.BLACK2}
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
          data={searchedServices}
          keyExtractor={(item) => `${item.serviceAdditionalChargeId}`}
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

AddServicesScreen.propTypes = {
  services: PropTypes.array.isRequired,
  setServices: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

AddServicesScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    //
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddServicesScreen);
