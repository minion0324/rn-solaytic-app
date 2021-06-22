import React, { useMemo, useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLocation } from 'react-native-map-link';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';

import {
  HeaderBar,
  DefaultButton,
} from 'src/components';
import {
  SVGS,
  COLORS,
  JOB_STATUS,
  SIZE1,
  SIZE2,
  SIZE4,
  WIDTH,
  HEIGHT
} from 'src/constants';
import {
  popScreen,
} from 'src/navigation';
import {
  Jobs,
} from 'src/redux';
import {
  getCustomerSiteAddress,
} from 'src/utils';

import {
  Container,
  Content,
  ContentWrap,
  ShadowWrap,
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
  TitleText,
  InfoText,
} from 'src/styles/text.styles';

import {
  LocationWrap,
  IconWrap,
  ButtonWrap,
  LocationIcon,
  Location1Line,
  Location2Line,
  Location3Line,
  MapBackButton,
  NavigationView,
  DefaultButtonWrap,
  AddressText
} from './styled';
import { LabelText } from '../../styles/text.styles';

const {
  AddressIcon,
  Phone1Icon,
  Phone2Icon,
  MapIcon,
  BackIcon,
  MapMarkerIcon,
} = SVGS;

const AddressScreen = ({
  focusedJob,
  jobStatus,
  customerSiteIndex,
  componentId,
}) => {
  const isDisabled = useMemo(() => {
    return JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus);
  }, [jobStatus]);

  const [position, setPosition] = useState();
  const [myPosition, setMyPosition] = useState();
  const [dest, setDest] = useState();
  const [selectedIndex, setIndex] = useState(customerSiteIndex)

  const mapRef = useRef(null);

  const API_KEY = "AIzaSyDcl2jp2LbfdnczTZm1r_azsWTNcKkjvRE";
  const mode = 'driving'; // 'walking';
  const ASPECT_RATIO = WIDTH / HEIGHT;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const SPACE = 0.01;
  const DEFAULT_PADDING = { top: 100, right: 100, bottom: 100, left: 100 };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestionLocationPermission();
    } else {
      getCurrentLocation();
    }
  }, []);

  async function requestionLocationPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'Wasteporter needs acess to your location'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getCurrentLocation();
    } else {
      alert('Location permission denied');
    }
  }

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const crd = position.coords;
        setMyPosition({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121
        });
      },
      (error) => {
        console.log(error.code)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    const selectedLocation = {
      latitude: focusedJob.steps[selectedIndex].latitude,
      longitude: focusedJob.steps[selectedIndex].longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    }

    setPosition(selectedLocation);
  }

  const navigate = () => {
    const dest_data = {
      latitude: focusedJob.steps[selectedIndex].latitude,
      longitude: focusedJob.steps[selectedIndex].longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    };
    setDest(dest_data);
  }

  const onBack = () => {
    popScreen(componentId);
  };

  const onLocation = () => {
    showLocation(position);
  };

  const selectCurrentLocation = (index) => {
    setIndex(index);

    const selectedLocation = {
      latitude: focusedJob.steps[index].latitude,
      longitude: focusedJob.steps[index].longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    }

    setPosition(selectedLocation);
    mapRef.current.animateToRegion(selectedLocation)
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => selectCurrentLocation(index)}>
        <SpaceView mTop={SIZE2} />
        <ContentWrap
          mLeft={SIZE1} mRight={SIZE1}
        >
          <LocationWrap>
            <IconWrap>
              {
                index === selectedIndex ?
                  <LocationIcon color={COLORS.BLUE5}>
                    <TitleText color={COLORS.BLUE5}>{index + 1}</TitleText>
                  </LocationIcon>
                  :
                  <LocationIcon>
                    <TitleText>{index + 1}</TitleText>
                  </LocationIcon>
              }
            </IconWrap>
            <FlexWrap>
              {
                index === customerSiteIndex ?
                  <View>
                    <TitleText color={index === selectedIndex && COLORS.BLUE5}>
                      {`[${focusedJob.customer.accountCustomerId}] ${focusedJob.customer.customerName}`}
                    </TitleText>
                    <SpaceView mTop={SIZE1} />
                  </View>
                  : <TitleText color={index === selectedIndex && COLORS.BLUE5}>
                    {item.siteName}
                  </TitleText>
              }
              <SpaceView mTop={SIZE1} />
              <AddressText>
                {
                  item.site &&
                    index === customerSiteIndex
                    ? getCustomerSiteAddress(item.site)
                    : item.address
                }
              </AddressText>
            </FlexWrap>
          </LocationWrap>
        </ContentWrap>
        {
          index === 0
            ? <Location1Line />
            : index === 1
              ? focusedJob.steps.length === 2
                ? <Location3Line />
                : <Location2Line />
              : <Location3Line />
        }
      </TouchableOpacity>
    );
  };

  const MapViewDirectionsError = error => {
    if (error) {
      alert("Load route can't be displayed");
      setDest(null);
    }
  }

  return (
    <View flex={1}>
      {
        position &&
        <MapView
          ref={mapRef}
          style={{ height: HEIGHT / 2 }}
          initialRegion={position}>
          <Marker
            coordinate={position}>
            <MapMarkerIcon />
          </Marker>
          {
            dest &&
            <>
              <Marker
                coordinate={dest}>
                <MapMarkerIcon />
              </Marker>
              <MapViewDirections
                resetOnChange={true}
                origin={myPosition}
                destination={dest}
                apikey={API_KEY}
                strokeWidth={4}
                strokeColor="hotpink"
                onError={MapViewDirectionsError}
              />
            </>
          }
        </MapView>
      }
      <MapBackButton onPress={onBack}>
        <BackIcon />
      </MapBackButton>
      <NavigationView>
        <FlatList
          data={focusedJob.steps}
          keyExtractor={(item) => `${item.jobStepId}`}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
        <DefaultButtonWrap forCenter>
          <DefaultButton
            color={COLORS.BLUE5}
            text={'Navigate'}
            mTop={SIZE1}
            mBottom={SIZE4}
            onPress={onLocation}
          />
        </DefaultButtonWrap>
      </NavigationView>
    </View>
  );
};

AddressScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  jobStatus: PropTypes.string.isRequired,
  customerSiteIndex: PropTypes.number.isRequired,
  componentId: PropTypes.string.isRequired,
};

AddressScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    jobStatus: Jobs.selectors.getJobStatus(state),
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressScreen);
