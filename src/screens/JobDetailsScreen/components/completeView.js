import React from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  SVGS,
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
  Printing,
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
} from '../styled';

const {
  DeactiveBinInIcon,
  DeactiveBinOutIcon,
} = SVGS;

const CompleteView = ({
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  jobStatus,
  services,

  focusedJob,

  onBack,
  onPrint,

  getBinInOutInfoIndex,
  getCustomerSiteIndex,
}) => {

  const renderJobProof = () => {
    if (photos.length === 0 && !sign.uri) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
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
        <SpaceView mTop={SIZE2} />
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
                key={`${item.serviceAdditionalChargeTemplateId}`}
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
            <SpaceView mTop={SIZE2} />
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
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <FlexWrap>
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <TitleText>DO Number</TitleText>
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

          {
            (
              (
                focusedJob.assignedDriver &&
                focusedJob.assignedDriver.driverName
              ) ||
              (
                focusedJob.assignedVehicle &&
                focusedJob.assignedVehicle.vehicleName
              )
            ) &&
            <View>
              <SpaceView mTop={SIZE4} />
              <RowWrap>
                {
                  focusedJob.assignedDriver &&
                  focusedJob.assignedDriver.driverName &&
                  <FlexWrap>
                    <LabelText>Driver</LabelText>
                    <InfoText>
                      {focusedJob.assignedDriver.driverName}
                    </InfoText>
                  </FlexWrap>
                }
                {
                  focusedJob.assignedVehicle &&
                  focusedJob.assignedVehicle.vehicleName &&
                  <FlexWrap>
                    <LabelText>Vehicle</LabelText>
                    <InfoText>
                      {focusedJob.assignedVehicle.vehicleName}
                    </InfoText>
                  </FlexWrap>
                }
              </RowWrap>
            </View>
          }

          <SpaceView mTop={SIZE4} />
        </ContentWrap>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderBar
        centerIcon={<ScreenText>{jobStatus}</ScreenText>}
        leftIcon={<Back />}
        rightIcon={
          jobStatus === JOB_STATUS.COMPLETED
          ? <Printing /> : <EmptyWrap />
        }
        onPressLeft={onBack}
        onPressRight={
          jobStatus === JOB_STATUS.COMPLETED
          ? () => onPrint(getBinInOutInfoIndex, getCustomerSiteIndex)
          : null
        }
      />
    );
  };

  return (
    <Container>
      <ShadowWrap>
        { renderHeader() }
      </ShadowWrap>

      <Content>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          { renderCustomerCopy() }
          { renderBinInfo() }
          { renderServices() }
          { renderJobProof() }

          <SpaceView mTop={SIZE2} />
        </ScrollView>
      </Content>
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

  focusedJob: PropTypes.object.isRequired,

  onBack: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,

  getBinInOutInfoIndex: PropTypes.func.isRequired,
  getCustomerSiteIndex: PropTypes.func.isRequired,
};

CompleteView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default CompleteView;
