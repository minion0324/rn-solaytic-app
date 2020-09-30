import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  SIZE10,
  JOB_STATUS,
  JOB_TYPE,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
  ItemWrap,
} from 'src/components';
import {
  showOverlay,
  dismissOverlay,
  CUSTOM_MODAL_SCREEN,
} from 'src/navigation';
import {
  delay,
} from 'src/utils';

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
  ModalWrap,
  ModalTopText,
  ModalInput,
  OkCancelRow,
  OkCancelButton,
  OkCancelText,
} from 'src/styles/modal.styles';

import {
  JobProofItem,
  HalfWrap,
  SignInfo,
  SignInfoText,
  CancelButton,
  PhotoAndSignWrap,
  PhotoAndSignText,
  AmountButton,
  DriverNoteBadge,
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
  CancelIcon,
  CameraIcon,
  SignIcon,
  UpArrowIcon,
  DownArrowIcon,
  CircleIcon,
} = SVGS;

const ProgressView = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  setBinInfo,
  jobStatus,
  services,
  isInProgress,

  focusedJob,

  onBack,
  onAcknowledge,
  onStart,
  onExchange,
  onComplete,
  onPhoto,
  onSign,
  onCancelPhoto,
  onCancelSign,
  onUpdateAmountCollected,
  onAlertNotProgress,
  onFail,
  onAddress,
  onDriverNote,
  onAddServices,
  onBinInfo,

  getBinInOutInfoIndex,
  getCustomerSiteIndex,
}) => {
  const [ paymentsActive, setPaymentsActive ] = useState(false);

  const isForComplete = () => {
    return (
      (jobStatus === JOB_STATUS.IN_PROGRESS2 ||
      (jobStatus === JOB_STATUS.IN_PROGRESS1 && focusedJob.steps.length === 2))
    );
  };

  const onShowAmountModal = () => {
    if (!onAlertNotProgress()) {
      return;
    }

    showOverlay(CUSTOM_MODAL_SCREEN, {
      offsetFromCenter: SIZE10,
      dismissible: false,
      getContent: renderAmountModal,
    });
  };

  const onDismissAmountModal = async (containerId) => {
    Keyboard.dismiss();

    await delay(100);
    dismissOverlay(containerId);
  };

  const onAddAmount = (amount, containerId) => {
    if (!amount) {
      Alert.alert('Warning', 'Please enter amount.');
      return;
    }

    onUpdateAmountCollected(amount);
    onDismissAmountModal(containerId);
  };

  const renderAmountModal = (containerId, { modalData, setModalData }) => {
    return (
      <ModalWrap>
        <ModalTopText>Enter amount</ModalTopText>
        <ModalInput
          underlineColorAndroid={COLORS.TRANSPARENT1}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={text => setModalData(text)}
          value={modalData}
          keyboardType={'numeric'}
        />
        <OkCancelRow>
          <OkCancelButton
            onPress={() => onDismissAmountModal(containerId)}
          >
            <OkCancelText>Cancel</OkCancelText>
          </OkCancelButton>
          <OkCancelButton
            onPress={() => onAddAmount(modalData, containerId)}
          >
            <OkCancelText>Ok</OkCancelText>
          </OkCancelButton>
        </OkCancelRow>
      </ModalWrap>
    );
  };

  const renderPhotoAndSign = () => {
    if (!isForComplete()) {
      return null;
    }

    return (
      <ShadowWrap>
        <PhotoAndSignWrap>
          <TouchableOpacity onPress={onPhoto}>
            <RowWrap>
              <CameraIcon />
              <PhotoAndSignText>Photo</PhotoAndSignText>
            </RowWrap>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSign}>
            <RowWrap>
              <SignIcon />
              <PhotoAndSignText>Sign</PhotoAndSignText>
            </RowWrap>
          </TouchableOpacity>
        </PhotoAndSignWrap>
      </ShadowWrap>
    );
  };

  const renderJobProof = () => {
    if (photos.length === 0 && !sign.uri) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <ImageIcon />
            <SpaceView mLeft={SIZE2} />
            <TitleText>
              Job Proof
            </TitleText>
          </RowWrap>
        </ContentWrap>
        <WrapBorder />
        <ContentWrap>
          {
            photos.map((photo, index) =>
              <ItemWrap
                deactivated
                mLeft={SIZE1} mRight={SIZE1}
                key={photo.uri}
              >
                <JobProofItem>
                  <FullImage source={{ uri: photo.uri }} />
                  <CancelButton
                    onPress={() => onCancelPhoto(index)}
                  >
                    <CancelIcon />
                  </CancelButton>
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
                <CancelButton onPress={onCancelSign}>
                  <CancelIcon />
                </CancelButton>
              </JobProofItem>
            </ItemWrap>
          }
        </ContentWrap>
      </View>
    );
  }

  const renderFailJob = () => {
    if (!isInProgress) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity onPress={onFail}>
          <ContentWrap>
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  <FailIcon />
                  <SpaceView mLeft={SIZE2} />
                  <TitleText>
                    Fail Job
                  </TitleText>
                </RowWrap>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
              <RedRightArrowIcon />
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  const renderServices = () => {
    if (
      !isInProgress ||
      services.length === 0
    ) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity onPress={onAddServices}>
          <ContentWrap>
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  <ServiceIcon />
                  <SpaceView mLeft={SIZE2} />
                  <TitleText>
                    Add Services
                  </TitleText>
                </RowWrap>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
              <BlueRightArrowIcon />
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPayments = () => {
    if (!focusedJob.isEnabledCashCollection) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity
          disabled={!isInProgress}
          onPress={() => setPaymentsActive(!paymentsActive)}
        >
          <ContentWrap>
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  <PaymentIcon />
                  <SpaceView mLeft={SIZE2} />
                  <TitleText>
                    {
                      'Payments: Cash $' +
                      (
                        (focusedJob.amountToCollect || 0) +
                        (focusedJob.collectedAmount || 0)
                      )
                    }
                  </TitleText>
                </RowWrap>
              </FlexWrap>
              {
                isInProgress &&
                <View>
                  <SpaceView mLeft={SIZE2} />
                  {
                    paymentsActive
                    ? <UpArrowIcon />
                    : <DownArrowIcon />
                  }
                </View>
              }
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
        {
          paymentsActive &&
          <View>
            <WrapBorder />
            <ContentWrap>
              <RowWrap>
                <CircleIcon />
                <SpaceView mLeft={SIZE2} />
                <InfoText>
                  {
                    'Collected: $' +
                    `${focusedJob.amountToCollect || 0}`
                  }
                </InfoText>
              </RowWrap>
              <SpaceView mTop={SIZE2} />
              <RowWrap>
                <CircleIcon />
                <SpaceView mLeft={SIZE2} />
                <InfoText>{'Others: $'}</InfoText>
                <AmountButton
                  onPress={onShowAmountModal}
                >
                  <InfoText numberOfLines={1}>
                    {focusedJob.collectedAmount || ''}
                  </InfoText>
                </AmountButton>
              </RowWrap>
            </ContentWrap>
          </View>
        }
      </View>
    );
  };

  const renderBinInfo = () => {
    const editable = isInProgress && focusedJob.isAllowDriverEditOnApp;

    return (
      binInfo.map((item, index) => {
        const idx = getBinInOutInfoIndex(index);

        console.log('------------ item');
        console.log(item);

        return (
          (item.wasteType || item.binType) &&
          <View key={`${item.jobStepId}`}>
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

  const renderDriverNote = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity
          disabled={!isInProgress}
          onPress={onDriverNote}
        >
          <ContentWrap>
            <RowWrap>
              <ChatIcon />
              <SpaceView mLeft={SIZE2} />
              <TitleText>Driver Note</TitleText>
              {
                focusedJob.haveUnreadMessage &&
                <DriverNoteBadge />
              }
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
        {
          focusedJob.messages.length > 0 &&
          <View>
            <WrapBorder />
            <TouchableOpacity
              disabled={!isInProgress}
              onPress={onDriverNote}
            >
              <ContentWrap>
                <RowWrap>
                  <FlexWrap>
                    <InfoText>
                      {focusedJob.messages[0].message}
                    </InfoText>
                  </FlexWrap>
                  {
                    isInProgress &&
                    <View>
                      <SpaceView mLeft={SIZE2} />
                      <BlueRightArrowIcon />
                    </View>
                  }
                </RowWrap>
              </ContentWrap>
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  };

  const renderType = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <SpaceView mTop={SIZE1} />
          <RowWrap>
            <FlexWrap flex={4}>
              <TitleText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </TitleText>
            </FlexWrap>
            <FlexWrap flex={6}>
              <RowWrap>
                <DateIcon />
                <SpaceView mLeft={SIZE1} />
                <LabelText>
                  {
                    moment(focusedJob.jobTimeSpecific || focusedJob.jobDate)
                      .format('DD-MMM (ddd)')
                  }
                </LabelText>
                <SpaceView mLeft={SIZE2} />
                <TimeIcon />
                <SpaceView mLeft={SIZE1} />
                <LabelText>
                  {
                    moment(focusedJob.jobTimeSpecific || focusedJob.jobDate)
                      .format('hh:mm A')
                  }
                </LabelText>
              </RowWrap>
            </FlexWrap>
          </RowWrap>
          <SpaceView mTop={SIZE1} />
        </ContentWrap>
      </View>
    );
  };

  const renderContact = () => {
    const { steps } = focusedJob;

    const index = getCustomerSiteIndex();

    if (
      !steps[index].contactPersonOne ||
      !steps[index].contactNumberOne
    ) {
      return null;
    }

    return (
      <View>
        <RowWrap>
          <SpaceView mLeft={SIZE4} />
          <WrapBorder />
        </RowWrap>
        <TouchableOpacity
          onPress={() => onAddress(index)}
        >
          <ContentWrap>
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  <PersonContactIcon />
                  <SpaceView mLeft={SIZE2} />
                  <InfoText numberOfLines={1}>
                    {steps[index].contactPersonOne}
                  </InfoText>
                </RowWrap>
              </FlexWrap>
              <FlexWrap>
                <RowWrap>
                  <NumberContactIcon />
                  <SpaceView mLeft={SIZE2} />
                  <InfoText numberOfLines={1}>
                    {steps[index].contactNumberOne}
                  </InfoText>
                </RowWrap>
              </FlexWrap>
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLocation = () => {
    const { steps } = focusedJob;

    const index = getCustomerSiteIndex();

    return (
      <TouchableOpacity
        onPress={() => onAddress(index)}
      >
        <ContentWrap mTop={SIZE1}>
          <RowWrap>
            <FlexWrap>
              <InfoText>
                {steps[index].address}
              </InfoText>
            </FlexWrap>
            <SpaceView mLeft={SIZE2} />
            <BlueRightArrowIcon />
          </RowWrap>
        </ContentWrap>
      </TouchableOpacity>
    );
  };

  const renderButton = () => {
    if (JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)) {
      return (
        <DefaultButton
          color={COLORS.BLUE1}
          text={'Acknowledge'}
          onPress={onAcknowledge}
          loading={loading}
        />
      );
    }

    if (jobStatus === JOB_STATUS.ACKNOWLEDGED) {
      return (
        <DefaultButton
          color={COLORS.BLUE1}
          text={'Start'}
          onPress={onStart}
          loading={loading}
        />
      );
    }

    if (
      focusedJob.steps.length === 3 &&
      jobStatus === JOB_STATUS.IN_PROGRESS1
    ) {
      return (
        <DefaultButton
          color={COLORS.PURPLE1}
          text={'Exchange'}
          onPress={onExchange}
          loading={loading}
        />
      );
    }

    if (
      jobStatus === JOB_STATUS.IN_PROGRESS1 ||
      jobStatus === JOB_STATUS.IN_PROGRESS2
    ) {
      return (
        <DefaultButton
          color={COLORS.GREEN1}
          text={'Complete'}
          onPress={onComplete}
          loading={loading}
        />
      );
    }

    return (
      <ScreenText>{jobStatus}</ScreenText>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderBar
        centerIcon={renderButton()}
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
        { renderLocation() }
        { renderContact() }
      </ShadowWrap>

      <Content>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          { renderType() }
          { renderDriverNote() }
          { renderBinInfo() }
          { renderPayments() }
          { renderServices() }
          { renderFailJob() }
          { renderJobProof() }

          <SpaceView mTop={SIZE2} />
        </ScrollView>
      </Content>

      { renderPhotoAndSign() }
    </Container>
  );
};

ProgressView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  jobStatus: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  isInProgress: PropTypes.bool.isRequired,

  focusedJob: PropTypes.object.isRequired,

  onBack: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onExchange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onCancelPhoto: PropTypes.func.isRequired,
  onCancelSign: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onAddress: PropTypes.func.isRequired,
  onDriverNote: PropTypes.func.isRequired,
  onAddServices: PropTypes.func.isRequired,
  onBinInfo: PropTypes.func.isRequired,

  getBinInOutInfoIndex: PropTypes.func.isRequired,
  getCustomerSiteIndex: PropTypes.func.isRequired,
};

ProgressView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default ProgressView;
