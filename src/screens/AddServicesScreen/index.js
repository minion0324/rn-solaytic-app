import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

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
  Close,
  Check,
} from 'src/styles/header.styles';

import {
  ServiceItem,
  ServiceText,
  ServiceInput,
  QuantityWrap,
} from './styled';

const {
  SearchIcon,
  ActiveServiceIcon,
  BlueActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
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

  const onClose = () => {
    popScreen(componentId);
  };

  const onCheck = () => {
    const newServices = originServices.map((item) => (
      item.isSelected &&
      (!item.quantity || item.quantity === '0')
      ? { ...item, isSelected: false }
      : item
    ));
    setServices(newServices);
    onClose();
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
            quantity:
              (!item.quantity || item.quantity === '0')
              ? '1' : item.quantity,
          });
        }}
        mLeft={SIZE2} mTop={0.5}
        mRight={SIZE2} mBottom={0.5}
      >
        <ServiceItem>
          <FlexWrap>
            <RowWrap>
              {
                item.isSelected
                ? <BlueActiveCircleCheckIcon />
                : <DeactiveCircleCheckIcon />
              }
              <SpaceView mLeft={SIZE2} />
              <ServiceText numberOfLines={1}>
                {item.serviceAdditionalChargeName}
              </ServiceText>
            </RowWrap>
          </FlexWrap>
          <TouchableWithoutFeedback>
            <QuantityWrap>
              {
                item.isSelected &&
                <ServiceInput
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  value={`${item.quantity}`}
                  onChangeText={(text) =>
                    onUpdateOriginService(index, {
                      ...item,
                      quantity: text,
                    })
                  }
                  keyboardType={'numeric'}
                />
              }
            </QuantityWrap>
          </TouchableWithoutFeedback>
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
              <ActiveServiceIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText>Add Services</ScreenText>
            </RowWrap>
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
          data={searchedServices}
          keyExtractor={(item) =>
            `${item.serviceAdditionalChargeTemplateId}`
          }
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

export default AddServicesScreen;
