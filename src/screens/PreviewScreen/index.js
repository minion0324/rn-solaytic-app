import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import {
  SVGS,
  IMAGES,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
} from 'src/constants';
import {
  HeaderBar,
} from 'src/components';
import {
  User,
  Jobs,
} from 'src/redux';
import {
  popScreen,
} from 'src/navigation';

import {
  showOverlay,
  BLUETOOTH_PRINTER_SCREEN,
} from 'src/navigation';

import {
  Container,
  ContentWrap,
  WrapBorder,
  ShadowWrap,
  FullImage,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  Back,
  Sharing,
} from 'src/styles/header.styles';
import {
  TitleText,
  InfoText,
} from 'src/styles/text.styles';

import {
  HalfWrap,
  LogoImageWrap,
} from './styled';

const {
  PrintIcon,
} = SVGS;

const PreviewScreen = ({
  ownerInfo,
  focusedJob,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  services,
  getBinInOutInfoIndex,
  getCustomerSiteIndex,
  componentId,
}) => {
  const viewShotRef = useRef(null);

  const onBack = () => {
    popScreen(componentId);
  };

  const onViewShot = async () => {
    try {
      return await viewShotRef.current.capture();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const onPrint = async () => {
    try {
      const base64Str = await onViewShot();

      showOverlay(BLUETOOTH_PRINTER_SCREEN, { base64Str });
    } catch (error) {
      //
    }
  };

  const onShare = async () => {
    try {
      const base64Str = await onViewShot();

      const mediaType = 'image/png';
      const base64Data = `data:${mediaType};base64,${base64Str}`;

      await Share.open({ url: base64Data });
    } catch (error) {
      //
    }
  };

  const renderNote = () => {
    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <InfoText align={'center'}>
          {
            'Kindly note that the maximum weight \n' +
            'allowed per loading not exceeding 10 (ten) \n' +
            'tonnes under ROV regulation, customers \n' +
            'are to bear all fine due to overloading.'
          }
        </InfoText>
      </View>
    );
  };

  const renderJobProof = () => {
    if (!sign.uri) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE4} />

        <HalfWrap>
          <FullImage source={{ uri: sign.uri }} />
        </HalfWrap>
        <WrapBorder />

        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <FlexWrap flex={4}>
            <InfoText>
              Site Contact
            </InfoText>
          </FlexWrap>
          <FlexWrap flex={6}>
            <InfoText>
              {signedUserName}
            </InfoText>
          </FlexWrap>
        </RowWrap>

        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <FlexWrap flex={4}>
            <InfoText>
              Telephone
            </InfoText>
          </FlexWrap>
          <FlexWrap flex={6}>
            <InfoText>
              {signedUserContact}
            </InfoText>
          </FlexWrap>
        </RowWrap>
      </View>
    );
  };

  const renderServices = () => {
    const selectedServices = services.filter(item => item.isSelected);
    if (selectedServices.length === 0) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE4} />

        <InfoText>
          ADDITIONAL SERVICE
        </InfoText>

        <SpaceView mTop={SIZE1} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              ITEM
            </InfoText>
          </FlexWrap>
          <InfoText>
            QTY
          </InfoText>
        </RowWrap>

        {
          selectedServices.map((item) => (
            <View
              key={`${item.serviceAdditionalChargeId}`}
            >
              <SpaceView mTop={SIZE1} />
              <RowWrap>
                <FlexWrap>
                  <InfoText>
                    {item.serviceAdditionalChargeName}
                  </InfoText>
                </FlexWrap>
                <InfoText>
                  {item.quantity || 1}
                </InfoText>
              </RowWrap>
            </View>
          ))
        }
      </View>
    );
  };

  const renderPayment = () => {
    if (!focusedJob.isEnabledCashCollection) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              PAYMENT
            </InfoText>
          </FlexWrap>
          <InfoText>
            CASH
          </InfoText>
        </RowWrap>
        <SpaceView mTop={SIZE1} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              Collected
            </InfoText>
          </FlexWrap>
          <InfoText>
            {
              '$' + (focusedJob.collectedAmount || 0)
            }
          </InfoText>
        </RowWrap>
      </View>
    );
  };

  const renderBinInfo = () => {
    return (
      binInfo.map((item, index) => {
        const idx = getBinInOutInfoIndex(index);

        return (
          (item.wasteType || item.binType) &&
          <View key={`${item.jobStepId}`}>
            <SpaceView mTop={SIZE4} />
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  {
                    'Bin'
                    + (idx === 0 ? ' Collected' : '')
                    + (idx === 1 ? ' Delivered' : '')
                  }
                </InfoText>
              </FlexWrap>
              <InfoText>
                {item['binNumber']}
              </InfoText>
            </RowWrap>
            <SpaceView mTop={SIZE1} />
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  Bin Type
                </InfoText>
              </FlexWrap>
              <InfoText>
                {item['binType'] && item['binType']['binTypeName']}
              </InfoText>
            </RowWrap>

          </View>
        );
      })
    );
  };

  const renderJobInfo = () => {
    const index = getCustomerSiteIndex();

    return (
      <View>
        <SpaceView mTop={SIZE4} />
        <TitleText>
          {`DO #: ${focusedJob.jobNumber}`}
        </TitleText>

        <SpaceView mTop={SIZE2} />
        <InfoText>
          SITE ADDRESS
        </InfoText>
        <SpaceView mTop={SIZE1} />
        <InfoText>
          {focusedJob.steps[index].address}
        </InfoText>

        <SpaceView mTop={SIZE4} />
        <TitleText>
          JOB COMPLETED
        </TitleText>

        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              {
                moment(
                  focusedJob.completedDate || focusedJob.jobTimeSpecific
                ).format('DD/MM/YYYY')
              }
            </InfoText>
          </FlexWrap>
          <InfoText>
            {
              moment(
                focusedJob.completedDate || focusedJob.jobTimeSpecific
              ).format('hh:mm A')
            }
          </InfoText>
        </RowWrap>

        <SpaceView mTop={SIZE1} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              Driver
            </InfoText>
          </FlexWrap>
          <InfoText>
            {focusedJob.assignedDriver.driverName}
          </InfoText>
        </RowWrap>

        <SpaceView mTop={SIZE1} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              Vehicle
            </InfoText>
          </FlexWrap>
          <InfoText>
            {focusedJob.assignedVehicle.vehicleName}
          </InfoText>
        </RowWrap>

        <SpaceView mTop={SIZE4} />
        <RowWrap>
          <FlexWrap>
            <InfoText>
              Job Type
            </InfoText>
          </FlexWrap>
          <InfoText>
            {focusedJob.jobTemplateName || focusedJob.jobTypeName}
          </InfoText>
        </RowWrap>
      </View>
    );
  };

  const renderOwnerInfo = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <InfoText align={'center'}>
          {ownerInfo.accountName}
        </InfoText>

        <InfoText align={'center'}>
          {ownerInfo.address}
        </InfoText>
        <InfoText align={'center'}>
          {
            (ownerInfo.phone ? `Tel: ${ownerInfo.phone}` : '') +
            (ownerInfo.phone && ownerInfo.faxNumber ? '  ,  ' : '') +
            (ownerInfo.faxNumber ? `Fax: ${ownerInfo.faxNumber}` : '')
          }
        </InfoText>
        <InfoText align={'center'}>
          {
            (ownerInfo.uenNumber ? `UEN: ${ownerInfo.uenNumber}` : '') +
            (ownerInfo.uenNumber && ownerInfo.gstNumber ? '  ,  ' : '') +
            (ownerInfo.gstNumber ? `GST: ${ownerInfo.gstNumber}` : '')
          }
        </InfoText>
      </View>
    );
  };

  const renderLogo = () => {
    return (
      <RowWrap>
        <FlexWrap flex={3} />
        <FlexWrap flex={4}>
          <LogoImageWrap>
            <FullImage
              resizeMode={'contain'}
              source={
                ownerInfo.logoImageUrl
                ? { uri: ownerInfo.logoImageUrl }
                : IMAGES.APP_LOGO
              }
            />
          </LogoImageWrap>
        </FlexWrap>
        <FlexWrap flex={3} />
      </RowWrap>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderBar
        centerIcon={
          <TouchableOpacity onPress={onPrint}>
            <RowWrap>
              <PrintIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText
                color={COLORS.BLUE1}
              >
                SEARCH PRINTER
              </ScreenText>
            </RowWrap>
          </TouchableOpacity>
        }
        leftIcon={<Back />}
        rightIcon={<Sharing />}
        onPressLeft={onBack}
        onPressRight={onShare}
      />
    );
  };

  return (
    <Container>
      <ShadowWrap>
        { renderHeader() }
      </ShadowWrap>

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ result: 'base64' }}
        >
          <ContentWrap>
            <SpaceView mTop={SIZE2} />

            { renderLogo() }
            { renderOwnerInfo() }
            { renderJobInfo() }
            { renderBinInfo() }
            { renderPayment() }
            { renderServices() }
            { renderJobProof() }
            { renderNote() }

            <SpaceView mTop={SIZE4} />
          </ContentWrap>
        </ViewShot>
      </ScrollView>
    </Container>
  );
};

PreviewScreen.propTypes = {
  ownerInfo: PropTypes.object.isRequired,
  focusedJob: PropTypes.object.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  services: PropTypes.array.isRequired,
  getBinInOutInfoIndex: PropTypes.func.isRequired,
  getCustomerSiteIndex: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

PreviewScreen.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

const mapStateToProps = (state) => {
  return {
    ownerInfo: User.selectors.getOwnerInfo(state),
    focusedJob: Jobs.selectors.getFocusedJob(state),
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreviewScreen);
