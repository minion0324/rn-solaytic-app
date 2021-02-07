import React, { useState, useMemo } from 'react';
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
  JOB_TYPE,
  JOB_STATUS,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
  ItemWrap,
} from 'src/components';
import {
  showLightBox,
  dismissLightBox,
  CUSTOM_MODAL_SCREEN,
} from 'src/navigation';
import {
  delay,
  getDate,
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
  Printing,
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
} from './styled';

const {
  BlueRightArrowIcon,
  RedRightArrowIcon,
  BlackRightArrowIcon,
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
  BlueActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
  PrintIcon,
} = SVGS;

const JobDetailsScreenView = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  jobStatus,
  services,
  cashIndex,
  setCashIndex,
  isInProgress,

  focusedJob,

  onBack,
  onAcknowledge,
  onStart,
  onPull,
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
  onPrint,
}) => {
  // const [ paymentsActive, setPaymentsActive ] = useState(false);

  const isForComplete = useMemo(() => {
    return (
      jobStatus === JOB_STATUS.IN_PROGRESS ||
      (
        jobStatus === JOB_STATUS.STARTED &&
        focusedJob.steps.length === 2
      )
    );
  }, [jobStatus]);

  const getBinInOutInfoIndex = (index) => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PUT:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS
        ) {
          return -1;
        }

        return 1;

      case JOB_TYPE.PULL:
        if (index !== 0) {
          return -1;
        }

        return 0;

      case JOB_TYPE.EXCHANGE:
        return index === 0 ? 1 : 0;

      case JOB_TYPE.OUT:
        if (index !== 0) {
          return -1;
        }

        return 1;

      case JOB_TYPE.SHIFT:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS
        ) {
          return -1;
        }

        if (
          jobStatus === JOB_STATUS.STARTED ||
          jobStatus === JOB_STATUS.COMPLETED
        ) {
          return 0;
        } else {
          return 1;
        }

      default:
        return -1;
    };
  };

  const getCustomerSiteIndex = () => {
    const { steps, jobTypeName } = focusedJob;

    if (jobTypeName === JOB_TYPE.PULL) {
      return 0;
    }

    if (jobTypeName === JOB_TYPE.PUT) {
      return 1;
    }

    if (jobTypeName === JOB_TYPE.EXCHANGE) {
      return 1;
    }

    if (steps.length === 2) {
      if (
        jobStatus === JOB_STATUS.DISPATCHED ||
        jobStatus === JOB_STATUS.ACKNOWLEDGED ||
        jobStatus === JOB_STATUS.STARTED
      ) {
        return 0;
      }

      return 1;
    }

    if (steps.length === 3) {
      if (
        jobStatus === JOB_STATUS.DISPATCHED ||
        jobStatus === JOB_STATUS.ACKNOWLEDGED
      ) {
        return 0;
      }

      if (jobStatus === JOB_STATUS.STARTED) {
        return 1;
      }

      return 2;
    }
  };

  // const onShowAmountModal = () => {
  //   if (!onAlertNotProgress()) {
  //     return;
  //   }

  //   showLightBox(CUSTOM_MODAL_SCREEN, {
  //     offsetFromCenter: SIZE10,
  //     dismissible: false,
  //     getContent: renderAmountModal,
  //   });
  // };

  // const onDismissAmountModal = async (containerId) => {
  //   Keyboard.dismiss();

  //   await delay(100);
  //   dismissLightBox(containerId);
  // };

  // const onAddAmount = (amount, containerId) => {
  //   if (!amount) {
  //     Alert.alert('Warning', 'Please enter amount.');
  //     return;
  //   }

  //   if (+amount <= 0) {
  //     Alert.alert('Warning', 'Please enter amount greater than 0.');
  //     return;
  //   }

  //   onUpdateAmountCollected(amount);
  //   onDismissAmountModal(containerId);
  // };

  // const renderAmountModal = (containerId, { modalData, setModalData }) => {
  //   return (
  //     <ModalWrap>
  //       <ModalTopText>Enter amount</ModalTopText>
  //       <ModalInput
  //         underlineColorAndroid={COLORS.TRANSPARENT1}
  //         autoCapitalize={'none'}
  //         autoCorrect={false}
  //         onChangeText={text => setModalData(text)}
  //         value={modalData}
  //         keyboardType={'numeric'}
  //       />
  //       <OkCancelRow>
  //         <OkCancelButton
  //           onPress={() => {
  //             if (!focusedJob.collectedAmount) {
  //               setCashIndex(-1);
  //             }
  //             onDismissAmountModal(containerId);
  //           }}
  //         >
  //           <OkCancelText>Cancel</OkCancelText>
  //         </OkCancelButton>
  //         <OkCancelButton
  //           onPress={() => onAddAmount(modalData, containerId)}
  //         >
  //           <OkCancelText>Ok</OkCancelText>
  //         </OkCancelButton>
  //       </OkCancelRow>
  //     </ModalWrap>
  //   );
  // };

  const renderPhotoAndSign = () => {
    if (!isForComplete) {
      return null;
    }

    return (
      <ShadowWrap forUp>
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
    if (
      (
        focusedJob.steps.length !== 2 ||
        jobStatus !== JOB_STATUS.STARTED
      ) &&
      jobStatus !== JOB_STATUS.IN_PROGRESS &&
      (photos.length === 0 && !sign.uri)
    ) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <FlexWrap>
              <RowWrap>
                <ImageIcon />
                <SpaceView mLeft={SIZE2} />
                <TitleText>
                  Job Proof
                </TitleText>
              </RowWrap>
            </FlexWrap>
            <TouchableOpacity
              onPress={() => onPrint(getBinInOutInfoIndex, getCustomerSiteIndex)}
            >
              <RowWrap>
                <PrintIcon />
                <SpaceView mLeft={SIZE2} />
                <TitleText>
                  Print
                </TitleText>
                <SpaceView mLeft={SIZE2} />
                <BlackRightArrowIcon />
              </RowWrap>
            </TouchableOpacity>
          </RowWrap>
        </ContentWrap>
        {
          !(photos.length === 0 && !sign.uri) &&
          <View>
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
        }
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
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <RedRightArrowIcon />
              </RowWrap>
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
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <BlueRightArrowIcon />
              </RowWrap>
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  // const renderPayments = () => {
  //   if (!focusedJob.isEnabledCashCollection) {
  //     return null;
  //   }

  //   return (
  //     <View>
  //       <SpaceView mTop={SIZE2} />
  //       <TouchableOpacity
  //         disabled={!isInProgress}
  //         onPress={() => setPaymentsActive(!paymentsActive)}
  //       >
  //         <ContentWrap>
  //           <RowWrap>
  //             <FlexWrap>
  //               <RowWrap>
  //                 <PaymentIcon />
  //                 <SpaceView mLeft={SIZE2} />
  //                 <TitleText>
  //                   {
  //                     cashIndex === -1
  //                     ? 'Payments'
  //                     : cashIndex === 0
  //                       ? focusedJob.amountToCollect
  //                         ? `Payments: Cash $${focusedJob.amountToCollect}`
  //                         : 'Payments'
  //                       : focusedJob.collectedAmount
  //                         ? `Payments: Cash $${focusedJob.collectedAmount}`
  //                         : 'Payments'
  //                   }
  //                 </TitleText>
  //               </RowWrap>
  //             </FlexWrap>
  //             {
  //               isInProgress &&
  //               <RowWrap>
  //                 <SpaceView mLeft={SIZE2} />
  //                 {
  //                   paymentsActive
  //                   ? <UpArrowIcon />
  //                   : <DownArrowIcon />
  //                 }
  //               </RowWrap>
  //             }
  //           </RowWrap>
  //         </ContentWrap>
  //       </TouchableOpacity>
  //       {
  //         paymentsActive &&
  //         <View>
  //           <WrapBorder />
  //           <ContentWrap>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 if (cashIndex !== 0) {
  //                   onUpdateAmountCollected(0);
  //                 }
  //                 setCashIndex(cashIndex === 0 ? -1 : 0);
  //               }}
  //             >
  //               <RowWrap>
  //                 {
  //                   cashIndex === 0
  //                   ? <BlueActiveCircleCheckIcon />
  //                   : <DeactiveCircleCheckIcon />
  //                 }
  //                 <SpaceView mLeft={SIZE2} />
  //                 <InfoText>
  //                   {
  //                     'Collected: $' +
  //                     `${focusedJob.amountToCollect || 0}`
  //                   }
  //                 </InfoText>
  //               </RowWrap>
  //             </TouchableOpacity>
  //             <SpaceView mTop={SIZE2} />
  //             <TouchableOpacity
  //               onPress={() => {
  //                 if (cashIndex !== 1) {
  //                   onShowAmountModal();
  //                 } else {
  //                   onUpdateAmountCollected(0);
  //                 }
  //                 setCashIndex(cashIndex === 1 ? -1 : 1);
  //               }}
  //             >
  //               <RowWrap>
  //                 {
  //                   cashIndex === 1
  //                   ? <BlueActiveCircleCheckIcon />
  //                   : <DeactiveCircleCheckIcon />
  //                 }
  //                 <SpaceView mLeft={SIZE2} />
  //                 <InfoText>{'Others: $'}</InfoText>
  //                 <AmountButton
  //                   onPress={onShowAmountModal}
  //                   disabled={cashIndex !== 1}
  //                 >
  //                   <InfoText numberOfLines={1}>
  //                     {focusedJob.collectedAmount || ''}
  //                   </InfoText>
  //                 </AmountButton>
  //               </RowWrap>
  //             </TouchableOpacity>
  //           </ContentWrap>
  //         </View>
  //       }
  //     </View>
  //   );
  // };

  const renderBinInfo = () => {
    return (
      binInfo.map((item, index) => {
        const idx = getBinInOutInfoIndex(index);

        return (
          (item.wasteType || item.binType) &&
          <View key={`${item.jobStepId}`}>
            <SpaceView mTop={SIZE2} />
            <TouchableOpacity
              disabled={!isInProgress}
              onPress={() => onBinInfo(index, idx)}
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
              disabled={!isInProgress}
              onPress={() => onBinInfo(index, idx)}
            >
              <ContentWrap>
                <RowWrap>
                  <FlexWrap>
                    <RowWrap>
                      <FlexWrap flex={6}>
                        <LabelText>Waste Type</LabelText>
                        <InfoText>
                          {item['wasteType'] && item['wasteType']['wasteTypeName']}
                        </InfoText>
                      </FlexWrap>
                      {
                        idx === 0 &&
                        focusedJob.isEnabledBinWeight &&
                        <FlexWrap flex={4}>
                          <LabelText>Nett Weight</LabelText>
                          <InfoText>
                            {item['binWeight'] || '-- --'}
                          </InfoText>
                        </FlexWrap>
                      }
                    </RowWrap>
                    <SpaceView mTop={SIZE2} />
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
                  </FlexWrap>
                  {
                    isInProgress &&
                    <RowWrap>
                      <SpaceView mLeft={SIZE2} />
                      <BlueRightArrowIcon />
                    </RowWrap>
                  }
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
              <FlexWrap>
                <RowWrap>
                  <ChatIcon />
                  <SpaceView mLeft={SIZE2} />
                  <TitleText>Driver Message</TitleText>
                  {
                    focusedJob.haveUnreadMessage &&
                    <DriverNoteBadge />
                  }
                </RowWrap>
              </FlexWrap>
              {
                isInProgress &&
                <RowWrap>
                  <SpaceView mLeft={SIZE2} />
                  <BlueRightArrowIcon />
                </RowWrap>
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
                <InfoText>
                  {focusedJob.messages[0].message}
                </InfoText>
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
        <ContentWrap
          mTop={SIZE2}
          color={COLORS.WHITE2}
        >
          <RowWrap>
            <FlexWrap flex={1}>
              <TitleText>
                {
                  (focusedJob.jobTemplateName || focusedJob.jobTypeName)
                    .toUpperCase()
                }
              </TitleText>
            </FlexWrap>
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
          </RowWrap>
        </ContentWrap>
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

        <ContentWrap
          mTop={SIZE4}
          color={COLORS.WHITE2}
        >
          <RowWrap>
            <FlexWrap>
              <InfoText>
                {steps[index].address}
              </InfoText>
            </FlexWrap>
            <RowWrap>
              <SpaceView mLeft={SIZE2} />
              <BlueRightArrowIcon />
            </RowWrap>
          </RowWrap>
        </ContentWrap>
      </TouchableOpacity>
    );
  };

  const renderHeaderContent = () => {
    const forToday = getDate() ===
      getDate(focusedJob.jobTimeSpecific || focusedJob.jobDate);

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
          color={
            forToday
            ? COLORS.BLUE1 : COLORS.GRAY3
          }
          text={'Start'}
          onPress={
            forToday ? onStart : null
          }
          loading={loading}
        />
      );
    }

    if (
      focusedJob.jobTypeName === JOB_TYPE.PULL &&
      jobStatus === JOB_STATUS.STARTED
    ) {
      return (
        <DefaultButton
          color={COLORS.PURPLE1}
          text={'Pull'}
          onPress={onPull}
          loading={loading}
        />
      );
    }

    if (
      focusedJob.steps.length === 3 &&
      jobStatus === JOB_STATUS.STARTED
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
      jobStatus === JOB_STATUS.STARTED ||
      jobStatus === JOB_STATUS.IN_PROGRESS
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
        centerIcon={renderHeaderContent()}
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
          { renderLocation() }
          { renderType() }
          { renderDriverNote() }
          { renderBinInfo() }
          {
            // renderPayments()
          }
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

JobDetailsScreenView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  jobStatus: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  cashIndex: PropTypes.number.isRequired,
  setCashIndex: PropTypes.func.isRequired,
  isInProgress: PropTypes.bool.isRequired,

  focusedJob: PropTypes.object.isRequired,

  onBack: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onPull: PropTypes.func.isRequired,
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
  onPrint: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default JobDetailsScreenView;
