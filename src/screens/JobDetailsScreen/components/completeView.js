import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  JOB_STATUS,
  JOB_TYPE,
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
  PersonContactIcon,
  NumberContactIcon,
  BlueRightArrowIcon,
  RedRightArrowIcon,
  DateIcon,
  TimeIcon,
  ChatIcon,
  ActiveBinInIcon,
  ActiveBinOutIcon,
  PaymentIcon,
  ServiceIcon,
  FailIcon,
  ImageIcon,
} = SVGS;

const CompleteView = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  setBinInfo,
  jobStatus,
  services,

  focusedJob,
  newCommentInfo,
  setNewCommentInfo,

  onBack,
  onAcknowledge,
  onStart,
  onExchange,
  onComplete,
  onPhoto,
  onSign,
  onCancelPhoto,
  onCancelSign,
  onFail,
  onUpdateAmountCollected,
  isInProgress,
  onAlertNotProgress,
  onAddress,
  onDriverNote,
  onAddServices,
  onBinInfo,

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
              <InfoText
                key={`${item.serviceAdditionalChargeId}`}
              >
                {item.serviceAdditionalChargeName}
              </InfoText>
            ))
          }
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
          <View>
            <SpaceView mTop={SIZE2} />
            <TouchableOpacity
              onPress={() => onBinInfo(item, idx)}
            >
            <ContentWrap>
              <RowWrap>
                {
                  idx === 0 &&
                  <RowWrap>
                    <ActiveBinInIcon />
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                }
                {
                  idx === 1 &&
                  <RowWrap>
                    <ActiveBinOutIcon />
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                }
                <TitleText>
                  {`Bin ${idx === 0 ? 'In' : idx === 1 ? 'Out' : ''}`}
                </TitleText>
              </RowWrap>
            </ContentWrap>
            </TouchableOpacity>
            <WrapBorder />
            <TouchableOpacity
              onPress={() => onBinInfo(item, idx)}
            >
              <ContentWrap>
                <RowWrap>
                  <FlexWrap>
                    <RowWrap>
                      <FlexWrap>
                        <LabelText>Waste Type</LabelText>
                        <InfoText>
                          {item['wasteType'] && item['wasteType']['wasteTypeName']}
                        </InfoText>
                      </FlexWrap>
                      {
                        focusedJob.isEnabledBinWeight &&
                        (!!item['binWeight'] || editable) &&
                        (
                          index !== 0 ||
                          focusedJob.jobTypeName !== JOB_TYPE.EXCHANGE
                        ) &&
                        <FlexWrap>
                          <LabelText>Nett Weight</LabelText>
                          <InfoText>
                            {item['binWeight']}
                          </InfoText>
                        </FlexWrap>
                      }
                    </RowWrap>
                    <SpaceView mTop={SIZE2} />
                    <RowWrap>
                      <FlexWrap>
                        <LabelText>Bin Type</LabelText>
                        <InfoText>
                          {item['binType'] && item['binType']['binTypeName']}
                        </InfoText>
                      </FlexWrap>
                      <FlexWrap>
                        <LabelText>Bin Id</LabelText>
                        <InfoText>
                          {item['binNumber']}
                        </InfoText>
                      </FlexWrap>
                    </RowWrap>
                  </FlexWrap>
                  <SpaceView mLeft={SIZE2} />
                  <BlueRightArrowIcon />
                </RowWrap>
              </ContentWrap>
            </TouchableOpacity>
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
          <LabelText>Customer</LabelText>
          <InfoText>
            {focusedJob.customer.customerName}
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <LabelText>Locations</LabelText>
          <InfoText>
            {focusedJob.steps[idx].address}
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <LabelText>Contact</LabelText>
          <InfoText>
            {
              focusedJob.steps[idx].contactPersonOne +
              '  |  ' +
              focusedJob.steps[idx].contactNumberOne
            }
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <LabelText>Date & Time</LabelText>
          <InfoText>
            {
              moment(focusedJob.jobTimeSpecific || focusedJob.jobDate).format('DD MMM') +
              '  |  ' +
              moment(focusedJob.jobTimeSpecific || focusedJob.jobDate).format('hh:mm A')
            }
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <RowWrap>
            <FlexWrap>
              <LabelText>Job Type</LabelText>
              <InfoText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </InfoText>
            </FlexWrap>
            <FlexWrap>
              <LabelText>Collections</LabelText>
              <InfoText>
                {''}
              </InfoText>
            </FlexWrap>
          </RowWrap>

          <SpaceView mTop={SIZE2} />
          <RowWrap>
            <FlexWrap>
              <LabelText>Driver</LabelText>
              <InfoText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </InfoText>
            </FlexWrap>
            <FlexWrap>
              <LabelText>Vehicle</LabelText>
              <InfoText>
                {''}
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
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  jobStatus: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,

  focusedJob: PropTypes.object.isRequired,
  newCommentInfo: PropTypes.object.isRequired,
  setNewCommentInfo: PropTypes.func.isRequired,

  onBack: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onExchange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onCancelPhoto: PropTypes.func.isRequired,
  onCancelSign: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  isInProgress: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
  onAddress: PropTypes.func.isRequired,
  onDriverNote: PropTypes.func.isRequired,
  onAddServices: PropTypes.func.isRequired,
  onBinInfo: PropTypes.func.isRequired,

  getBinInOutInfoIndex: PropTypes.func.isRequired,
  getCustomerSiteIndex: PropTypes.func.isRequired,
};

CompleteView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default CompleteView;
