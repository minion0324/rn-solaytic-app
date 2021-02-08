import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
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
  DriverNoteBadge,
  BinWrap,
  BinInput,
  PhotoWrap,
  SignWrap,
} from './styled';

const {
  BlueRightArrowIcon,
  DateIcon,
  TimeIcon,
  ChatIcon,
  ActiveBinInIcon,
  DeactiveBinInIcon,
  ActiveBinOutIcon,
  DeactiveBinOutIcon,
  ServiceIcon,
  FailIcon,
  ScanCodeIcon,
  UpArrowIcon,
  DownArrowIcon,
  GreenActiveCircleCheckIcon,
  BlueActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
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
  onAddWasteTypes,
  onScanCode,
  onPrint,
}) => {
  const [ started, setStarted ] = useState(false);

  // const [ paymentsActive, setPaymentsActive ] = useState(false);

  useEffect(() => {
    setStarted(jobStatus !== JOB_STATUS.ACKNOWLEDGED);
  }, [jobStatus]);

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
                {
                  <View>
                    <SpaceView mTop={SIZE2} />
                    <RowWrap>
                      <FlexWrap>
                        <LabelText>Bin ID</LabelText>
                        <BinInput
                          underlineColorAndroid={COLORS.TRANSPARENT1}
                          autoCapitalize={'none'}
                          autoCorrect={false}
                          placeholder={'BIN NUMBER'}
                          value={`${item['binNumber'] || ''}`}
                          onChangeText={(text) =>
                            onUpdateBinInfo(index, { binNumber: text })
                          }
                          editable={
                            status === 'ACTIVE' &&
                            focusedJob.isAllowDriverEditOnApp
                          }
                        />
                        <SpaceView mTop={SIZE1} />
                      </FlexWrap>
                      {
                        status !== 'COMPLETED' &&
                        <RowWrap>
                          <SpaceView mLeft={SIZE3} />
                          <TouchableOpacity
                            disabled={
                              !(
                                status === 'ACTIVE' &&
                                focusedJob.isAllowDriverEditOnApp
                              )
                            }
                            onPress={() => onScanCode(index)}
                          >
                            <ScanCodeIcon />
                          </TouchableOpacity>
                          <SpaceView mLeft={SIZE3} />
                          {
                            item['binNumber']
                            ? <GreenActiveCircleCheckIcon />
                            : <DeactiveCircleCheckIcon />
                          }
                        </RowWrap>
                      }
                    </RowWrap>
                    <BorderView
                      color={
                        status === 'ACTIVE' &&
                        options.IsRequireBinNumberToEnd
                        ? COLORS.BLUE1 : COLORS.GRAY2
                      }
                    />
                    <SpaceView mTop={SIZE2} />
                  </View>
                }

                {
                  item['binType'] &&
                  item['binType']['binTypeName'] &&
                  <View>
                    <SpaceView mTop={SIZE2} />
                    <RowWrap>
                      <FlexWrap>
                        <LabelText>Bin Type</LabelText>
                        <InfoText>
                          {
                            item['binType'] &&
                            item['binType']['binTypeName']
                          }
                        </InfoText>
                      </FlexWrap>
                    </RowWrap>
                    <SpaceView mTop={SIZE2} />
                  </View>
                }

                {
                  options.isRequireReviewWasteType &&
                  <View>
                    <SpaceView mTop={SIZE2} />
                    <RowWrap>
                      <FlexWrap>
                        <LabelText>For Waste Type</LabelText>
                        <TouchableOpacity
                          disabled={
                            !(
                              status === 'ACTIVE' &&
                              focusedJob.isAllowDriverEditOnApp
                            )
                          }
                          onPress={() => onAddWasteTypes(index)}
                        >
                          <InfoText>
                            {
                              item['wasteType'] &&
                              item['wasteType']['wasteTypeName']
                            }
                          </InfoText>
                        </TouchableOpacity>
                      </FlexWrap>
                      {
                        status === 'ACTIVE' &&
                        focusedJob.isAllowDriverEditOnApp &&
                        <TouchableOpacity
                          onPress={() => onAddWasteTypes(index)}
                        >
                          <RowWrap>
                            <SpaceView mLeft={SIZE2} />
                            <BlueRightArrowIcon />
                          </RowWrap>
                        </TouchableOpacity>
                      }
                    </RowWrap>
                    <SpaceView mTop={SIZE1} />
                    <BorderView
                      color={
                        status === 'ACTIVE'
                        ? COLORS.BLUE1 : COLORS.GRAY2
                      }
                    />
                    <SpaceView mTop={SIZE2} />
                  </View>
                }

                {
                  (
                    options.mustTakePhoto ||
                    options.mustTakeSignature
                  ) &&
                  <View>
                    <SpaceView mTop={SIZE4} />
                    <RowWrap>
                      <FlexWrap>
                        <RowWrap>
                          {
                            status === 'COMPLETED'
                            ? <DeactivePhotosIcon />
                            : <ActivePhotosIcon />
                          }
                          <SpaceView mLeft={SIZE2} />
                          <InfoText>Photos</InfoText>
                        </RowWrap>
                      </FlexWrap>
                      <RowWrap>
                        <SpaceView mLeft={SIZE2} />
                        <DeactiveCircleCheckIcon />
                      </RowWrap>
                    </RowWrap>
                    <SpaceView mTop={SIZE4} />
                    <RowWrap>
                      {
                        options.mustTakePhoto &&
                        [0, 1].map((index) => {
                          const data = photos.filter((photo) => (
                            photo.jobStepId === item.jobStepId
                          ));

                          return (
                            <>
                              <FlexWrap flex={2}>
                                {
                                  data[index]
                                  ? <TouchableOpacity
                                      onPress={null}
                                      disabled={status !== 'ACTIVE'}
                                    >
                                      <PhotoWrap>
                                        <FullImage source={{ uri: data[index].uri }} />
                                      </PhotoWrap>

                                    </TouchableOpacity>
                                  : <TouchableOpacity
                                      onPress={() => onPhoto(item.jobStepId)}
                                      disabled={status !== 'ACTIVE'}
                                    >
                                      <PhotoWrap>
                                        <LeftDash dashColor={COLORS.BLUE1} />
                                        <TopDash dashColor={COLORS.BLUE1} />
                                        <RightDash dashColor={COLORS.BLUE1} />
                                        <BottomDash dashColor={COLORS.BLUE1} />

                                        <PhotoAddIcon />
                                      </PhotoWrap>
                                    </TouchableOpacity>
                                }
                              </FlexWrap>
                              <SpaceView mLeft={SIZE2} />
                            </>
                          );
                        })
                      }

                      {
                        options.mustTakeSignature
                        ? <>
                            <FlexWrap flex={3}>
                              {
                                sign.uri
                                ? <TouchableOpacity
                                    onPress={onSign}
                                    disabled={status !== 'ACTIVE'}
                                  >
                                    <SignWrap>
                                      <FullImage source={{ uri: sign.uri }} />
                                    </SignWrap>
                                  </TouchableOpacity>
                                : <TouchableOpacity
                                    onPress={onSign}
                                    disabled={status !== 'ACTIVE'}
                                  >
                                    <SignWrap>
                                      <LeftDash dashColor={COLORS.GREEN1} />
                                      <TopDash dashColor={COLORS.GREEN1} />
                                      <RightDash dashColor={COLORS.GREEN1} />
                                      <BottomDash dashColor={COLORS.GREEN1} />

                                      <SignAddIcon />
                                    </SignWrap>
                                  </TouchableOpacity>
                              }
                            </FlexWrap>
                            {
                              !options.mustTakePhoto &&
                              <>
                                <SpaceView mLeft={SIZE4} />
                                <FlexWrap flex={4} />
                              </>
                            }
                          </>
                        : <FlexWrap flex={3} />
                      }
                    </RowWrap>
                    <SpaceView mTop={SIZE4} />
                  </View>
                }

                {
                  options.isRequirePaymentCollection &&
                  <View>
                    <SpaceView mTop={SIZE4} />
                    <RowWrap>
                      <FlexWrap>
                        <RowWrap>
                          {
                            status === 'COMPLETED'
                            ? <DeactivePhotosIcon />
                            : <ActivePaymentIcon />
                          }
                          <SpaceView mLeft={SIZE2} />
                          <InfoText>Collect</InfoText>
                        </RowWrap>
                      </FlexWrap>
                      <RowWrap>
                        <SpaceView mLeft={SIZE2} />
                        <DeactiveCircleCheckIcon />
                      </RowWrap>
                    </RowWrap>
                    <SpaceView mTop={SIZE4} />
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
                  </View>
                }

                {
                  <View>
                    <SpaceView mTop={SIZE4} />
                    <RowWrap>
                      <FlexWrap flex={1} />
                      <FlexWrap flex={2}>
                        <DefaultButton
                          color={
                            status === 'ACTIVE'
                            ? COLORS.BLUE1 : COLORS.WHITE1
                          }
                          text={
                            status === 'COMPLETED'
                            ? 'Completed' : 'Complete'
                          }
                          onPress={null}
                          textColor={
                            status === 'NOT_STARTED'
                            ? COLORS.BLUE1
                            : status === 'ACTIVE'
                              ? COLORS.WHITE1
                              : COLORS.BLACK2
                          }
                          bRadius={SIZE4}
                          borderColor={
                            status === 'NOT_STARTED'
                            ? COLORS.BLUE1 : COLORS.TRANSPARENT1
                          }
                        />
                      </FlexWrap>
                      <FlexWrap flex={1} />
                    </RowWrap>
                    <SpaceView mTop={SIZE4} />
                  </View>
                }
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
          <SpaceView mTop={SIZE2} />
        </ScrollView>
      </Content>
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
  onAddWasteTypes: PropTypes.func.isRequired,
  onScanCode: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default JobDetailsScreenView;
