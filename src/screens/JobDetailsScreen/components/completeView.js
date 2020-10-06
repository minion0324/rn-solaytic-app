import React, { useState, useRef } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
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
  JOB_STATUS,
} from 'src/constants';
import {
  HeaderBar,
  ItemWrap,
} from 'src/components';
import {
  delay,
} from 'src/utils';
import {
  showOverlay,
  BLUETOOTH_PRINTER_SCREEN,
} from 'src/navigation';

import {
  Container,
  Content,
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
  EmptyWrap,
  Back,
} from 'src/styles/header.styles';
import {
  TitleText,
  InfoText,
  LabelText,
} from 'src/styles/text.styles';

import {
  JobProofItem,
  HalfWrap,
  SignInfo,
  SignInfoText,
  PrintAndShareWrap,
  PrintAndShareText,
  LogoImageWrap,
} from '../styled';

const {
  DeactiveBinInIcon,
  DeactiveBinOutIcon,
  PrintIcon,
  ShareIcon,
} = SVGS;

const CompleteView = ({
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  jobStatus,
  services,

  ownerInfo,
  focusedJob,

  onBack,

  getBinInOutInfoIndex,
  getCustomerSiteIndex,
}) => {
  const [ showing, setShowing ] = useState(false);

  const viewShotRef = useRef(null);

  const onViewShot = async () => {
    try {
      setShowing(true);

      await delay(1000);

      return await viewShotRef.current.capture();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const onPrint = async () => {
    try {
      const base64Str = await onViewShot();

      showOverlay(BLUETOOTH_PRINTER_SCREEN, { base64Str });

      setShowing(false);
    } catch (error) {
      setShowing(false);
    }
  };

  const onShare = async () => {
    try {
      const base64Str = await onViewShot();

      const mediaType = 'image/png';
      const base64Data = `data:${mediaType};base64,${base64Str}`;

      await Share.open({ url: base64Data });

      setShowing(false);
    } catch (error) {
      setShowing(false);
    }
  };

  const renderPrintAndShare = () => {
    if (jobStatus !== JOB_STATUS.COMPLETED) {
      return null;
    }

    return (
      <ShadowWrap>
        <PrintAndShareWrap>
          <TouchableOpacity onPress={onPrint}>
            <RowWrap>
              <PrintIcon />
              <PrintAndShareText>Print</PrintAndShareText>
            </RowWrap>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
            <RowWrap>
              <ShareIcon />
              <PrintAndShareText>Share</PrintAndShareText>
            </RowWrap>
          </TouchableOpacity>
        </PrintAndShareWrap>
      </ShadowWrap>
    );
  };

  const renderJobProof = () => {
    if (photos.length === 0 && !sign.uri) {
      return null;
    }

    return (
      <View>
        {
          showing
          ? <WrapBorder />
          : <SpaceView mTop={SIZE2} />
        }
        <ContentWrap>
          <TitleText>
            JOB PROOF
          </TitleText>
        </ContentWrap>
        <WrapBorder />
        <ContentWrap>
          {
            photos.map((photo) =>
              <ItemWrap
                deactivated
                mLeft={SIZE1} mRight={SIZE1}
                key={photo.uri}
              >
                <JobProofItem>
                  <FullImage source={{ uri: photo.uri }} />
                </JobProofItem>
              </ItemWrap>
            )
          }
          {
            !!sign.uri &&
            <ItemWrap
              deactivated
              mLeft={SIZE1} mRight={SIZE1}
            >
              <JobProofItem>
                <HalfWrap>
                  <FullImage source={{ uri: sign.uri }} />
                </HalfWrap>
                <HalfWrap>
                  <SignInfo>
                    <SignInfoText numberOfLines={1}>
                      {signedUserName}
                    </SignInfoText>
                  </SignInfo>
                  <SignInfo>
                    <SignInfoText numberOfLines={1}>
                      {signedUserContact}
                    </SignInfoText>
                  </SignInfo>
                </HalfWrap>
              </JobProofItem>
            </ItemWrap>
          }
        </ContentWrap>
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
        {
          showing
          ? <WrapBorder />
          : <SpaceView mTop={SIZE2} />
        }
        <ContentWrap>
          <TitleText>
            ADDITIONAL SERVICE
          </TitleText>
        </ContentWrap>
        <WrapBorder />
        <ContentWrap>
          {
            selectedServices.map((item) => (
              <View
                key={`${item.serviceAdditionalChargeId}`}
              >
                <SpaceView mTop={SIZE2} />
                <InfoText>
                  {`${item.serviceAdditionalChargeName} * ${item.quantity || 1}`}
                </InfoText>
              </View>
            ))
          }
          <SpaceView mTop={SIZE2} />
        </ContentWrap>
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
            {
              showing
              ? <WrapBorder />
              : <SpaceView mTop={SIZE2} />
            }
            <ContentWrap>
              <RowWrap>
                {
                  idx === 0 &&
                  <RowWrap>
                    <DeactiveBinInIcon />
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                }
                {
                  idx === 1 &&
                  <RowWrap>
                    <DeactiveBinOutIcon />
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                }
                <TitleText>
                  {`Bin ${idx === 0 ? 'In' : idx === 1 ? 'Out' : ''}`}
                </TitleText>
              </RowWrap>
            </ContentWrap>
            <WrapBorder />
            <ContentWrap>
              <SpaceView mTop={SIZE2} />
              <RowWrap>
                <FlexWrap flex={6}>
                  <LabelText>Waste Type</LabelText>
                  <InfoText>
                    {item['wasteType'] && item['wasteType']['wasteTypeName']}
                  </InfoText>
                </FlexWrap>
                {
                  index === 1 &&
                  focusedJob.isEnabledBinWeight &&
                  <FlexWrap flex={4}>
                    <LabelText>Nett Weight</LabelText>
                    <InfoText>
                      {item['binWeight'] || '-- --'}
                    </InfoText>
                  </FlexWrap>
                }
              </RowWrap>
              <SpaceView mTop={SIZE4} />
              <RowWrap>
                <FlexWrap flex={6}>
                  <LabelText>Bin Type</LabelText>
                  <InfoText>
                    {item['binType'] && item['binType']['binTypeName']}
                  </InfoText>
                </FlexWrap>
                <FlexWrap flex={4}>
                  <LabelText>Bin ID</LabelText>
                  <InfoText>
                    {item['binNumber']}
                  </InfoText>
                </FlexWrap>
              </RowWrap>
              <SpaceView mTop={SIZE4} />
            </ContentWrap>
          </View>
        );
      })
    );
  };

  const renderCustomerCopy = () => {
    const idx = getCustomerSiteIndex();

    return (
      <View>
        {
          showing
          ? <WrapBorder />
          : <SpaceView mTop={SIZE2} />
        }
        <ContentWrap>
          <RowWrap>
            <FlexWrap>
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <TitleText>
                  Customer Copy
                </TitleText>
              </RowWrap>
            </FlexWrap>
            <FlexWrap>
              <TitleText>{focusedJob.jobNumber}</TitleText>
            </FlexWrap>
          </RowWrap>
        </ContentWrap>
        <WrapBorder />
        <ContentWrap>
          <SpaceView mTop={SIZE2} />
          <LabelText>Customer</LabelText>
          <InfoText>
            {focusedJob.customer.customerName}
          </InfoText>

          <SpaceView mTop={SIZE4} />
          <LabelText>Locations</LabelText>
          <InfoText>
            {focusedJob.steps[idx].address}
          </InfoText>

          {
            !!focusedJob.steps[idx].contactPersonOne &&
            !!focusedJob.steps[idx].contactNumberOne &&
            <View>
              <SpaceView mTop={SIZE4} />
              <LabelText>Contact</LabelText>
              <InfoText>
                {
                  focusedJob.steps[idx].contactPersonOne +
                  '  |  ' +
                  focusedJob.steps[idx].contactNumberOne
                }
              </InfoText>
            </View>
          }

          <SpaceView mTop={SIZE4} />
          <LabelText>Completed Date & Time</LabelText>
          <InfoText>
            {
              moment(focusedJob.completedDate || focusedJob.jobTimeSpecific).format('DD MMM') +
              '  |  ' +
              moment(focusedJob.completedDate || focusedJob.jobTimeSpecific).format('hh:mm A')
            }
          </InfoText>

          <SpaceView mTop={SIZE4} />
          <RowWrap>
            <FlexWrap>
              <LabelText>Job Type</LabelText>
              <InfoText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </InfoText>
            </FlexWrap>
            {
              focusedJob.isEnabledCashCollection &&
              <FlexWrap>
                <LabelText>Collections</LabelText>
                <InfoText>
                  {
                    '$' + (focusedJob.collectedAmount || 0)
                  }
                </InfoText>
              </FlexWrap>
            }
          </RowWrap>

          <SpaceView mTop={SIZE4} />
          <RowWrap>
            <FlexWrap>
              <LabelText>Driver</LabelText>
              <InfoText>
                {focusedJob.assignedDriver.driverName}
              </InfoText>
            </FlexWrap>
            <FlexWrap>
              <LabelText>Vehicle</LabelText>
              <InfoText>
                {focusedJob.assignedVehicle.vehicleName}
              </InfoText>
            </FlexWrap>
          </RowWrap>

          <SpaceView mTop={SIZE4} />
        </ContentWrap>
      </View>
    );
  };

  const renderReceiptHeader = () => {
    if (!showing) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
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
            <SpaceView mLeft={SIZE4} />
            <FlexWrap flex={6}>
              <TitleText>
                {ownerInfo.accountName}
              </TitleText>
              <SpaceView mTop={SIZE1} />

              <InfoText>
                {ownerInfo.address}
              </InfoText>
              <InfoText>
                {
                  (ownerInfo.phone ? `Tel: ${ownerInfo.phone}  ` : '') +
                  (ownerInfo.faxNumber ? `Fax: ${ownerInfo.faxNumber}  ` : '')
                }
              </InfoText>
              <InfoText>
                {
                  (ownerInfo.uenNumber ? `UEN: ${ownerInfo.uenNumber}  ` : '') +
                  (ownerInfo.gstNumber ? `GST: ${ownerInfo.gstNumber}  ` : '')
                }
              </InfoText>
            </FlexWrap>
          </RowWrap>
        </ContentWrap>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderBar
        centerIcon={<ScreenText>{jobStatus}</ScreenText>}
        leftIcon={<Back />}
        rightIcon={<EmptyWrap />}
        onPressLeft={onBack}
      />
    );
  };

  return (
    <Container>
      <ShadowWrap>
        { renderHeader() }
      </ShadowWrap>

      <Content
        color={
          showing
          ? COLORS.WHITE1 : COLORS.WHITE2
        }
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <ViewShot
            ref={viewShotRef}
            options={{ result: 'base64' }}
          >
            { renderReceiptHeader() }
            { renderCustomerCopy() }
            { renderBinInfo() }
            { renderServices() }
            { renderJobProof() }

            {
              !showing &&
              <SpaceView mTop={SIZE2} />
            }
          </ViewShot>
        </ScrollView>
      </Content>

      { renderPrintAndShare() }
    </Container>
  );
};

CompleteView.propTypes = {
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  jobStatus: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,

  ownerInfo: PropTypes.object.isRequired,
  focusedJob: PropTypes.object.isRequired,

  onBack: PropTypes.func.isRequired,

  getBinInOutInfoIndex: PropTypes.func.isRequired,
  getCustomerSiteIndex: PropTypes.func.isRequired,
};

CompleteView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default CompleteView;
