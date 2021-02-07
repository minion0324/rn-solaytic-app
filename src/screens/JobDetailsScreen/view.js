import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { pick } from 'lodash';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
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
  BorderView,
  ShadowWrap,
  FullImage,
  RowWrap,
  FlexWrap,
  SpaceView,
  CenteredWrap,
  LeftDash,
  TopDash,
  RightDash,
  BottomDash,
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
  BinWrap,
  BinInput,
  PhotoWrap,
  SignWrap,
} from './styled';

const {
  BlueRightArrowIcon,
  BlackRightArrowIcon,
  DateIcon,
  TimeIcon,
  ChatIcon,
  ActiveBinInIcon,
  DeactiveBinInIcon,
  ActiveBinOutIcon,
  DeactiveBinOutIcon,
  PaymentIcon,
  ServiceIcon,
  FailIcon,
  ImageIcon,
  CancelIcon,
  CameraIcon,
  SignIcon,
  ScanCodeIcon,
  UpArrowIcon,
  DownArrowIcon,
  GreenActiveCircleCheckIcon,
  BlueActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
  PrintIcon,
  ActivePhotosIcon,
  DeactivePhotosIcon,
  PhotoAddIcon,
  SignAddIcon,
  ActivePaymentIcon,
  DeactivePaymentIcon,
  ActiveBinIcon,
  DeactiveBinIcon,
} = SVGS;

const JobDetailsScreenView = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  setBinInfo,
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
  const [ started, setStarted ] = useState(
    jobStatus !== JOB_STATUS.ACKNOWLEDGED,
  );

  // const [ paymentsActive, setPaymentsActive ] = useState(false);

  // const isForComplete = useMemo(() => {
  //   return (
  //     jobStatus === JOB_STATUS.IN_PROGRESS ||
  //     (
  //       jobStatus === JOB_STATUS.STARTED &&
  //       focusedJob.steps.length === 2
  //     )
  //   );
  // }, [jobStatus]);

  const currentStep = useMemo(() => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        return 0;

      case JOB_TYPE.PUT:
        return 0;

      case JOB_TYPE.EXCHANGE:
        if (jobStatus === JOB_STATUS.ACKNOWLEDGED) {
          return started ? 1 : 0;
        }

        return 0;

      case JOB_TYPE.ON_THE_SPOT:
        return 0;

      default:
        return 0; // ?
    };
  }, [
    started,
    jobStatus,
    focusedJob.jobTypeName,
  ]);

  const totalStep = useMemo(() => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        return 2;

      case JOB_TYPE.PUT:
        return 1;

      case JOB_TYPE.EXCHANGE:
        return 3;

      case JOB_TYPE.ON_THE_SPOT:
        return 2;

      default:
        return 2; // ?
    };
  }, [
    focusedJob.jobTypeName,
  ]);

  const getBinInOutInfoIndex = useCallback(
    (index) => {
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
    },
    [
      jobStatus,
      focusedJob.jobTypeName,
    ],
  );

  const getCustomerSiteIndex = useCallback(
    () => {
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
    },
    [
      jobStatus,
      focusedJob.steps,
      focusedJob.jobTypeName,
    ],
  );

  const getBinInfoOptions = useCallback(
    (index) => pick(
      focusedJob.steps[index],
      [
        'isRequireBinNumberToEnd',
        'isRequireBinNumberToStart',
        'isRequireBinType',
        'isRequireBinWeight',
        'isRequirePaymentCollection',
        'isRequireReviewWasteType',
        'mustTakePhoto',
        'mustTakeSignature',
        'requireStatusToEnd',
      ],
    ),
    [focusedJob.steps],
  );

  const getBinInfoStatus = useCallback(
    (index) => {
      if (currentStep - index < 1) {
        return 'NOT_STARTED';
      } else if (currentStep - index === 1) {
        return 'ACTIVE';
      } else {
        return 'COMPLETED';
      }
    },
    [currentStep],
  );

  const onStartJob = useCallback(
    () => {
      switch (focusedJob.jobTypeName) {
        case JOB_TYPE.PULL:
          onStart();
          return;

        case JOB_TYPE.PUT:
          return;

        case JOB_TYPE.EXCHANGE:
          setStarted(true);
          return;

        case JOB_TYPE.ON_THE_SPOT:
          return;

        default:
          return; // ?
      };
    },
    [
      started,
      focusedJob.jobTypeName,
    ],
  );

  const onUpdateBinInfo = (binIndex, newInfo) => {
    const newBinInfo = binInfo.slice(0);

    newBinInfo[binIndex] = {
      ...newBinInfo[binIndex],
      ...newInfo,
    };

    setBinInfo(newBinInfo);
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

  // const renderPhotoAndSign = () => {
  //   if (!isForComplete) {
  //     return null;
  //   }

  //   return (
  //     <ShadowWrap forUp>
  //       <PhotoAndSignWrap>
  //         <TouchableOpacity onPress={onPhoto}>
  //           <RowWrap>
  //             <CameraIcon />
  //             <PhotoAndSignText>Photo</PhotoAndSignText>
  //           </RowWrap>
  //         </TouchableOpacity>
  //         <TouchableOpacity onPress={onSign}>
  //           <RowWrap>
  //             <SignIcon />
  //             <PhotoAndSignText>Sign</PhotoAndSignText>
  //           </RowWrap>
  //         </TouchableOpacity>
  //       </PhotoAndSignWrap>
  //     </ShadowWrap>
  //   );
  // };

  // const renderJobProof = () => {
  //   if (
  //     (
  //       focusedJob.steps.length !== 2 ||
  //       jobStatus !== JOB_STATUS.STARTED
  //     ) &&
  //     jobStatus !== JOB_STATUS.IN_PROGRESS &&
  //     (photos.length === 0 && !sign.uri)
  //   ) {
  //     return null;
  //   }

  //   return (
  //     <View>
  //       <SpaceView mTop={SIZE2} />
  //       <ContentWrap>
  //         <RowWrap>
  //           <FlexWrap>
  //             <RowWrap>
  //               <ImageIcon />
  //               <SpaceView mLeft={SIZE2} />
  //               <TitleText>
  //                 Job Proof
  //               </TitleText>
  //             </RowWrap>
  //           </FlexWrap>
  //           <TouchableOpacity
  //             onPress={() => onPrint(getBinInOutInfoIndex, getCustomerSiteIndex)}
  //           >
  //             <RowWrap>
  //               <PrintIcon />
  //               <SpaceView mLeft={SIZE2} />
  //               <TitleText>
  //                 Print
  //               </TitleText>
  //               <SpaceView mLeft={SIZE2} />
  //               <BlackRightArrowIcon />
  //             </RowWrap>
  //           </TouchableOpacity>
  //         </RowWrap>
  //       </ContentWrap>
  //       {
  //         !(photos.length === 0 && !sign.uri) &&
  //         <View>
  //           <BorderView
  //             mLeft={SIZE2} mRight={SIZE2}
  //           />
  //           <ContentWrap>
  //             {
  //               photos.map((photo, index) =>
  //                 <ItemWrap
  //                   deactivated
  //                   mLeft={SIZE1} mRight={SIZE1}
  //                   key={photo.uri}
  //                 >
  //                   <JobProofItem>
  //                     <FullImage source={{ uri: photo.uri }} />
  //                     <CancelButton
  //                       onPress={() => onCancelPhoto(index)}
  //                     >
  //                       <CancelIcon />
  //                     </CancelButton>
  //                   </JobProofItem>
  //                 </ItemWrap>
  //               )
  //             }
  //             {
  //               !!sign.uri &&
  //               <ItemWrap
  //                 deactivated
  //                 mLeft={SIZE1} mRight={SIZE1}
  //               >
  //                 <JobProofItem>
  //                   <HalfWrap>
  //                     <FullImage source={{ uri: sign.uri }} />
  //                   </HalfWrap>
  //                   <HalfWrap>
  //                     <SignInfo>
  //                       <SignInfoText numberOfLines={1}>
  //                         {signedUserName}
  //                       </SignInfoText>
  //                     </SignInfo>
  //                     <SignInfo>
  //                       <SignInfoText numberOfLines={1}>
  //                         {signedUserContact}
  //                       </SignInfoText>
  //                     </SignInfo>
  //                   </HalfWrap>
  //                   <CancelButton onPress={onCancelSign}>
  //                     <CancelIcon />
  //                   </CancelButton>
  //                 </JobProofItem>
  //               </ItemWrap>
  //             }
  //           </ContentWrap>
  //         </View>
  //       }
  //     </View>
  //   );
  // }

  const renderFailJob = () => {
    if (
      !isInProgress ||
      !focusedJob.isEnableFailJob
    ) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <CenteredWrap>
          <TouchableOpacity onPress={onFail}>
            <ContentWrap
              color={COLORS.TRANSPARENT1}
            >
              <RowWrap>
                <FailIcon />
                <SpaceView mLeft={SIZE1} />
                <TitleText>
                  Fail Job
                </TitleText>
              </RowWrap>
            </ContentWrap>
          </TouchableOpacity>
        </CenteredWrap>
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
  //           <BorderView
  //             mLeft={SIZE2} mRight={SIZE2}
  //           />
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
        if (
          !item.binType &&
          !item.wasteType
        ) {
          return null;
        }

        const idx = getBinInOutInfoIndex(index);
        const options = getBinInfoOptions(index);
        const status = getBinInfoStatus(index);

        return (
          <View key={`${item.jobStepId}`}>
            <SpaceView mTop={SIZE2} />
            <BinWrap
              active={status === 'ACTIVE'}
            >
              <ContentWrap
                mLeft={0.1} mRight={0.1}
              >
                <RowWrap>
                  <RowWrap>
                    {
                      (
                        status === 'NOT_STARTED' ||
                        status === 'ACTIVE'
                      ) && (
                        idx === 0
                        ? <ActiveBinInIcon />
                        : idx === 1
                          ? <ActiveBinOutIcon />
                          : <ActiveBinIcon />
                      )
                    }
                    {
                      status === 'COMPLETED' && (
                        idx === 0
                        ? <DeactiveBinInIcon />
                        : idx === 1
                          ? <DeactiveBinOutIcon />
                          : <DeactiveBinIcon />
                      )
                    }
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                  <TitleText>
                    {
                      idx === 0
                      ? 'BIN IN'
                      : idx === 1
                        ? 'BIN OUT'
                        : 'WASTE COLLECTION'
                    }
                  </TitleText>
                </RowWrap>
              </ContentWrap>
              <BorderView />
              <ContentWrap
                mLeft={0.1} mRight={0.1}
              >
                <SpaceView mTop={SIZE3} />
                <RowWrap>
                  <FlexWrap>
                    <LabelText>
                      {
                        focusedJob.isRequiredBinNumberToStart
                        ? 'Bin ID *' : 'Bin ID'
                      }
                    </LabelText>
                    <BinInput
                      underlineColorAndroid={COLORS.TRANSPARENT1}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      placeholder={'BIN NUMBER'}
                      value={`${item['binNumber'] || ''}`}
                      onChangeText={(text) =>
                        onUpdateBinInfo(index, { binNumber: text })
                      }
                      editable={focusedJob.isAllowDriverEditOnApp}
                    />
                    <SpaceView mTop={SIZE1} />
                  </FlexWrap>
                  <SpaceView mLeft={SIZE3} />
                  <ScanCodeIcon />
                  <SpaceView mLeft={SIZE3} />
                  {
                    item['binNumber']
                    ? <GreenActiveCircleCheckIcon />
                    : <DeactiveCircleCheckIcon />
                  }

                  {
                    // <FlexWrap flex={6}>
                    //   <LabelText>Waste Type</LabelText>
                    //   <InfoText>
                    //     {item['wasteType'] && item['wasteType']['wasteTypeName']}
                    //   </InfoText>
                    // </FlexWrap>
                  }

                  {
                    // idx === 0 &&
                    // focusedJob.isEnabledBinWeight &&
                    // <FlexWrap flex={4}>
                    //   <LabelText>Nett Weight</LabelText>
                    //   <InfoText>
                    //     {item['binWeight'] || '-- --'}
                    //   </InfoText>
                    // </FlexWrap>
                  }
                </RowWrap>
                <BorderView />

                <SpaceView mTop={SIZE4} />
                <RowWrap>
                  <FlexWrap>
                    <LabelText>Bin Type</LabelText>
                    <InfoText>
                      {item['binType'] && item['binType']['binTypeName']}
                    </InfoText>
                  </FlexWrap>

                  {
                    // <FlexWrap flex={6}>
                    //   <LabelText>Bin Type</LabelText>
                    //   <InfoText>
                    //     {item['binType'] && item['binType']['binTypeName']}
                    //   </InfoText>
                    // </FlexWrap>
                    // <FlexWrap flex={4}>
                    //   <LabelText>Bin ID</LabelText>
                    //   <InfoText>
                    //     {item['binNumber']}
                    //   </InfoText>
                    // </FlexWrap>
                  }
                </RowWrap>

                <SpaceView mTop={SIZE4} />
                <RowWrap>
                  <FlexWrap>
                    <LabelText>Waste Type</LabelText>
                    <InfoText>
                      {item['wasteType'] && item['wasteType']['wasteTypeName']}
                    </InfoText>
                  </FlexWrap>
                  <RowWrap>
                    <SpaceView mLeft={SIZE2} />
                    <BlueRightArrowIcon />
                  </RowWrap>
                </RowWrap>
                <SpaceView mTop={SIZE1} />
                <BorderView />

                <SpaceView mTop={SIZE4} />
                <RowWrap>
                  <FlexWrap>
                    <RowWrap>
                      <ActivePhotosIcon />
                      <SpaceView mLeft={SIZE2} />
                      <InfoText>Photos</InfoText>
                    </RowWrap>
                  </FlexWrap>
                  <RowWrap>
                    <SpaceView mLeft={SIZE2} />
                    <DeactiveCircleCheckIcon />
                  </RowWrap>
                </RowWrap>
                <SpaceView mTop={SIZE2} />
                <RowWrap>
                  <FlexWrap flex={2}>
                    <PhotoWrap>
                      <LeftDash dashColor={COLORS.BLUE1} />
                      <TopDash dashColor={COLORS.BLUE1} />
                      <RightDash dashColor={COLORS.BLUE1} />
                      <BottomDash dashColor={COLORS.BLUE1} />

                      <PhotoAddIcon />
                    </PhotoWrap>
                  </FlexWrap>
                  <SpaceView mLeft={SIZE2} />
                  <FlexWrap flex={2}>
                    <PhotoWrap>
                      <LeftDash dashColor={COLORS.BLUE1} />
                      <TopDash dashColor={COLORS.BLUE1} />
                      <RightDash dashColor={COLORS.BLUE1} />
                      <BottomDash dashColor={COLORS.BLUE1} />

                      <PhotoAddIcon />
                    </PhotoWrap>
                  </FlexWrap>
                  <SpaceView mLeft={SIZE2} />
                  <FlexWrap flex={3}>
                    <SignWrap>
                      <LeftDash dashColor={COLORS.GREEN1} />
                      <TopDash dashColor={COLORS.GREEN1} />
                      <RightDash dashColor={COLORS.GREEN1} />
                      <BottomDash dashColor={COLORS.GREEN1} />

                      <SignAddIcon />
                    </SignWrap>
                  </FlexWrap>
                </RowWrap>

                <SpaceView mTop={SIZE4} />
                <RowWrap>
                  <FlexWrap>
                    <RowWrap>
                      <ActivePaymentIcon />
                      <SpaceView mLeft={SIZE2} />
                      <InfoText>Collect</InfoText>
                    </RowWrap>
                  </FlexWrap>
                  <RowWrap>
                    <SpaceView mLeft={SIZE2} />
                    <DeactiveCircleCheckIcon />
                  </RowWrap>
                </RowWrap>
                <SpaceView mTop={SIZE2} />
                <RowWrap>
                  <View>
                    <InfoText>$</InfoText>
                    <SpaceView mTop={SIZE1} />
                  </View>
                  <SpaceView mLeft={SIZE4} />
                  <FlexWrap>
                    <InfoText>100</InfoText>
                    <SpaceView mTop={SIZE1} />
                    <BorderView />
                  </FlexWrap>
                  <SpaceView mLeft={SIZE4} />
                  <FlexWrap>
                    <InfoText>CASH</InfoText>
                    <SpaceView mTop={SIZE1} />
                    <BorderView />
                  </FlexWrap>
                </RowWrap>
                <SpaceView mTop={SIZE4} />

                <RowWrap>
                  <FlexWrap flex={1} />
                  <FlexWrap flex={2}>
                    <DefaultButton
                      color={COLORS.BLUE1}
                      text={'Complete'}
                      onPress={null}
                      bRadius={SIZE4}
                    />
                  </FlexWrap>
                  <FlexWrap flex={1} />
                </RowWrap>
                <SpaceView mTop={SIZE4} />
              </ContentWrap>
            </BinWrap>
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
            <BorderView
              mLeft={SIZE2} mRight={SIZE2}
            />
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

    if (currentStep === 0) {
      return (
        <DefaultButton
          color={
            forToday
            ? COLORS.BLUE1 : COLORS.GRAY3
          }
          text={'Start Job'}
          onPress={
            forToday ? onStartJob : null
          }
          loading={loading}
        />
      );
    }

    if (currentStep === 1) {
      return (
        <ScreenText>
          {`Step ${currentStep}/${totalStep}`}
        </ScreenText>
      );
    }

    // if (jobStatus === JOB_STATUS.ACKNOWLEDGED) {
    //   return (
    //     <DefaultButton
    //       color={
    //         forToday
    //         ? COLORS.BLUE1 : COLORS.GRAY3
    //       }
    //       text={'Start Job'}
    //       onPress={
    //         forToday ? onStart : null
    //       }
    //       loading={loading}
    //     />
    //   );
    // }

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
          {
            // renderJobProof()
          }

          <SpaceView mTop={SIZE2} />
        </ScrollView>
      </Content>

      {
        // renderPhotoAndSign()
      }
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
  setBinInfo: PropTypes.func.isRequired,
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
