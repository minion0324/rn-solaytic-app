import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { pick } from 'lodash';
import ActionSheet from 'react-native-actionsheet';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE3,
  SIZE4,
  JOB_TYPE,
  JOB_STATUS,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
} from 'src/components';
import {
  showLightBox,
  dismissLightBox,
  CUSTOM_MODAL_SCREEN,
} from 'src/navigation';

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
  DriverNoteBadge,
  BinWrap,
  BinInput,
  PhotoWrap,
  SignWrap,
  PhotoModalButtonsWrap,
} from './styled';

const {
  BlueRightArrowIcon,
  ActiveDateIcon,
  DeactiveDateIcon,
  ActiveTimeIcon,
  DeactiveTimeIcon,
  ActiveChatIcon,
  DeactiveChatIcon,
  ActiveBinInIcon,
  DeactiveBinInIcon,
  ActiveBinOutIcon,
  DeactiveBinOutIcon,
  ActiveServiceIcon,
  DeactiveServiceIcon,
  FailIcon,
  ScanCodeIcon,
  GreenActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
  ActivePhotosIcon,
  DeactivePhotosIcon,
  PhotoAddIcon,
  SignAddIcon,
  ActivePaymentIcon,
  DeactivePaymentIcon,
  ActiveBinIcon,
  DeactiveBinIcon,
  DeletePhotoIcon,
  BackPhotoIcon,
  ActiveBinWeightIcon,
  DeactiveBinWeightIcon,
  DropdownArrowIcon,
} = SVGS;

const STEP_STATUS_MARK = '_Next';

const JobDetailsScreenView = ({
  loading,
  photos,
  sign,
  binInfo,
  setBinInfo,
  jobStatus,
  services,
  amountCollected,
  setAmountCollected,
  jobPaymentType,
  setJobPaymentType,
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
  onFail,
  onAddress,
  onDriverNote,
  onAddServices,
  onAddWasteTypes,
  onScanCode,
  onPrint,
}) => {
  const [ stepStatus, setStepStatus ] = useState('');

  const actionSheetRef = useRef(null);

  useEffect(() => {
    setStepStatus(jobStatus);
  }, [jobStatus]);

  const currentStep = useMemo(() => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            return 0.5;
          case JOB_STATUS.ACKNOWLEDGED + STEP_STATUS_MARK:
            return 1;
          case JOB_STATUS.STARTED:
            return 2;
          case JOB_STATUS.IN_PROGRESS:
            return 3.5;
          case JOB_STATUS.COMPLETED:
            return 4;
        }
        return 0.5;

      case JOB_TYPE.PUT:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            return 0.5;
          case JOB_STATUS.ACKNOWLEDGED + STEP_STATUS_MARK:
            return 1;
          case JOB_STATUS.STARTED:
            return 3.5;
          case JOB_STATUS.COMPLETED:
            return 4;
        }
        return 0.5;

      case JOB_TYPE.EXCHANGE:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            return 0.5;
          case JOB_STATUS.ACKNOWLEDGED + STEP_STATUS_MARK:
            return 1;
          case JOB_STATUS.STARTED:
            return 1.5;
          case JOB_STATUS.STARTED + STEP_STATUS_MARK:
            return 2;
          case JOB_STATUS.IN_PROGRESS:
            return 3;
          case JOB_STATUS.IN_PROGRESS + STEP_STATUS_MARK:
            return 3.5;
          case JOB_STATUS.COMPLETED:
            return 4;
        }
        return 0.5;

      case JOB_TYPE.ON_THE_SPOT:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            return 0.5;
          case JOB_STATUS.ACKNOWLEDGED + STEP_STATUS_MARK:
            return 1;
          case JOB_STATUS.STARTED:
            return 2;
          case JOB_STATUS.IN_PROGRESS:
            return 3.5;
          case JOB_STATUS.COMPLETED:
            return 4;
        }
        return 0.5;

      default:
        return 0.5;
    };
  }, [
    stepStatus,
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
        return 2;
    };
  }, [
    focusedJob.jobTypeName,
  ]);

  const binWeightIndexes = useMemo(() => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        return { stepIndex: 1, binIndex: 0 };

      case JOB_TYPE.PUT:
        return { stepIndex: -1 };

      case JOB_TYPE.EXCHANGE:
        return { stepIndex: 2, binIndex: 1 };

      case JOB_TYPE.ON_THE_SPOT:
        return { stepIndex: 1, binIndex: 0 };

      default:
        return { stepIndex: -1 };
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

  const onNextStep = useCallback(
    () => {
      switch (focusedJob.jobTypeName) {
        case JOB_TYPE.PULL:
          if (currentStep === 0.5) {
            setStepStatus(jobStatus + STEP_STATUS_MARK);
          } else if (currentStep === 1) {
            onStart();
          } else if (currentStep === 2) {
            onPull();
          } else if (currentStep === 3.5) {
            onComplete();
          }
          return;

        case JOB_TYPE.PUT:
          if (currentStep === 0.5) {
            setStepStatus(jobStatus + STEP_STATUS_MARK);
          } else if (currentStep === 1) {
            onStart();
          } else if (currentStep === 3.5) {
            onComplete();
          }
          return;

        case JOB_TYPE.EXCHANGE:
          if (
            currentStep === 0.5 ||
            currentStep === 1.5 ||
            currentStep === 3
          ) {
            setStepStatus(jobStatus + STEP_STATUS_MARK);
          } else if (currentStep === 1) {
            onStart();
          } else if (currentStep === 2) {
            onExchange();
          } else if (currentStep === 3.5) {
            onComplete();
          }
          return;

        case JOB_TYPE.ON_THE_SPOT:
          case JOB_TYPE.PULL:
            if (currentStep === 0.5) {
              setStepStatus(jobStatus + STEP_STATUS_MARK);
            } else if (currentStep === 1) {
              onStart();
            } else if (currentStep === 2) {
              onExchange();
            } else if (currentStep === 3.5) {
              onComplete();
            }
          return;

        default:
          return;
      };
    },
    [
      currentStep,
      jobStatus,
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

  const onShowPhotoModal = (selectedPhoto) => {
    showLightBox(CUSTOM_MODAL_SCREEN, {
      props: { selectedPhoto },
      getContent: renderPhotoModal,
    });
  };

  const renderPhotoModal = (containerId, { selectedPhoto }) => {
    return (
      <PhotoWrap>
        <FullImage source={{ uri: selectedPhoto.uri }} />
        <PhotoModalButtonsWrap>
          <RowWrap>
            <FlexWrap>
              <DefaultButton
                color={COLORS.WHITE1}
                text={'Back'}
                onPress={() => {
                  dismissLightBox(containerId);
                }}
                textColor={COLORS.BLACK2}
                icon={<BackPhotoIcon />}
              />
            </FlexWrap>
            <SpaceView mLeft={SIZE2} />
            <FlexWrap>
              <DefaultButton
                color={COLORS.RED1}
                text={'Delete'}
                onPress={() => {
                  onCancelPhoto(selectedPhoto);
                  dismissLightBox(containerId);
                }}
                textColor={COLORS.WHITE1}
                icon={<DeletePhotoIcon />}
              />
            </FlexWrap>
          </RowWrap>
        </PhotoModalButtonsWrap>
      </PhotoWrap>
    );
  };

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
                  {
                    jobStatus === JOB_STATUS.COMPLETED
                    ? <DeactiveServiceIcon />
                    : <ActiveServiceIcon />
                  }
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

  const renderBinNumber = ({
    item,
    index,
    options,
    status,
  }) => (
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
  );

  const renderBinType = ({
    item,
  }) => (
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
  );

  const renderWasteType = ({
    item,
    index,
    status,
  }) => (
    // options.isRequireReviewWasteType &&
    <View>
      <SpaceView mTop={SIZE2} />
      <RowWrap>
        <FlexWrap>
          <LabelText>with Waste Type</LabelText>
          <TouchableOpacity
            disabled={
              !(
                status === 'ACTIVE' &&
                focusedJob.isAllowDriverEditOnApp
              )
            }
            onPress={() => onAddWasteTypes(index)}
          >
            {
              item['wasteTypes'].map((el) => (
                <InfoText key={el.wasteTypeId}>
                  {el.wasteType.wasteTypeName || ''}
                </InfoText>
              ))
            }
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
  );

  const renderPhotosAndSign = ({
    item,
    options,
    status,
  }) => (
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
        {
          status !== 'COMPLETED' &&
          <RowWrap>
            <SpaceView mLeft={SIZE2} />
            <DeactiveCircleCheckIcon />
          </RowWrap>
        }
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
              [
                <FlexWrap
                  key={`${index}-FlexWrap`}
                  flex={2}
                >
                  {
                    data[index]
                    ? <TouchableOpacity
                        onPress={() => onShowPhotoModal(data[index])}
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
                ,
                <SpaceView
                  key={`${index}-SpaceView`}
                  mLeft={SIZE2}
                />
              ]
            );
          })
        }

        {
          options.mustTakeSignature
          ? [
              <FlexWrap
                key={`Signature-FlexWrap`}
                flex={3}
              >
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
              ,
              !options.mustTakePhoto &&
              [
                <SpaceView
                  key={`EmptyPhoto-SpaceView`}
                  mLeft={SIZE4}
                />
                ,
                <FlexWrap
                  key={`EmptyPhoto-FlexWrap`}
                  flex={4}
                />
              ]
            ]
          : <FlexWrap flex={3} />
        }
      </RowWrap>
      <SpaceView mTop={SIZE4} />
    </View>
  );

  const renderPayment = ({
    options,
    status,
  }) => (
    options.isRequirePaymentCollection &&
    <View>
      <SpaceView mTop={SIZE4} />
      <RowWrap>
        <FlexWrap>
          <RowWrap>
            {
              status === 'COMPLETED'
              ? <DeactivePaymentIcon />
              : <ActivePaymentIcon />
            }
            <SpaceView mLeft={SIZE2} />
            <InfoText>
              {
                'Collect' +
                (
                  amountCollected
                  ? `: $${amountCollected} ` +
                    focusedJob.jobPaymentTypeList[jobPaymentType]
                  : ''
                )
              }
            </InfoText>
          </RowWrap>
        </FlexWrap>
        {
          status !== 'COMPLETED' &&
          <RowWrap>
            <SpaceView mLeft={SIZE2} />
            {
              amountCollected
              ? <GreenActiveCircleCheckIcon />
              : <DeactiveCircleCheckIcon />
            }
          </RowWrap>
        }
      </RowWrap>
      <SpaceView mTop={SIZE4} />
      <RowWrap>
        <View>
          <InfoText>$</InfoText>
          <SpaceView mTop={SIZE1} />
        </View>
        <SpaceView mLeft={SIZE4} />
        <FlexWrap>
          <BinInput
            underlineColorAndroid={COLORS.TRANSPARENT1}
            autoCapitalize={'none'}
            autoCorrect={false}
            placeholder={'Amount Collected'}
            value={`${amountCollected || ''}`}
            onChangeText={(text) =>
              setAmountCollected(text)
            }
            editable={
              status === 'ACTIVE' &&
              focusedJob.isAllowDriverEditOnApp
            }
            keyboardType={'numeric'}
          />
          <SpaceView mTop={SIZE1} />
          <BorderView />
        </FlexWrap>
        <SpaceView mLeft={SIZE4} />
        <FlexWrap>
          <TouchableOpacity
            onPress={() => actionSheetRef.current.show()}
            disabled={
              !(
                status === 'ACTIVE' &&
                focusedJob.isAllowDriverEditOnApp
              )
            }
          >
            <RowWrap>
              <SpaceView mLeft={SIZE1} />
              <FlexWrap>
                <InfoText>
                  {focusedJob.jobPaymentTypeList[jobPaymentType]}
                </InfoText>
              </FlexWrap>
              <SpaceView mLeft={SIZE1} />
              <DropdownArrowIcon />
              <SpaceView mLeft={SIZE1} />
            </RowWrap>
          </TouchableOpacity>
          <SpaceView mTop={SIZE1} />
          <BorderView />
        </FlexWrap>
      </RowWrap>
      <SpaceView mTop={SIZE4} />
    </View>
  );

  const renderCompleteButton = ({
    status,
  }) => (
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
            onPress={
              status === 'ACTIVE'
              ? onNextStep : null
            }
            loading={
              status === 'ACTIVE'
              ? loading : null
            }
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
  );

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
                  renderBinNumber({
                    item,
                    index,
                    options,
                    status,
                  })
                }
                {
                  renderBinType({
                    item,
                  })
                }
                {
                  renderWasteType({
                    item,
                    index,
                    status,
                  })
                }
                {
                  renderPhotosAndSign({
                    item,
                    options,
                    status,
                  })
                }
                {
                  renderPayment({
                    options,
                    status,
                  })
                }
                {
                  renderCompleteButton({
                    status,
                  })
                }
              </ContentWrap>
            </BinWrap>
          </View>
        );
      })
    );
  };

  const renderBinWeight = () => {
    const { stepIndex, binIndex } = binWeightIndexes;

    if (stepIndex === -1) {
      return null;
    }

    const options = getBinInfoOptions(stepIndex);
    const status = getBinInfoStatus(stepIndex);

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <BinWrap
          active={status === 'ACTIVE'}
        >
          <ContentWrap
            mLeft={0.1} mRight={0.1}
          >
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  {
                    status === 'COMPLETED'
                    ? <DeactiveBinWeightIcon />
                    : <ActiveBinWeightIcon />
                  }
                  <SpaceView mLeft={SIZE2} />
                  <TitleText>Bin Weight</TitleText>
                </RowWrap>
              </FlexWrap>
              {
                status !== 'COMPLETED' &&
                <RowWrap>
                  <SpaceView mLeft={SIZE2} />
                  {
                    binInfo[binIndex]['binWeight']
                    ? <GreenActiveCircleCheckIcon />
                    : <DeactiveCircleCheckIcon />
                  }
                </RowWrap>
              }
            </RowWrap>
          </ContentWrap>
          <BorderView />
          <ContentWrap
            mLeft={0.1} mRight={0.1}
          >
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  <FlexWrap>
                    <BinInput
                      underlineColorAndroid={COLORS.TRANSPARENT1}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      placeholder={'BIN WEIGHT'}
                      value={`${binInfo[binIndex]['binWeight'] || ''}`}
                      onChangeText={(text) =>
                        onUpdateBinInfo(binIndex, { binWeight: text })
                      }
                      editable={
                        status === 'ACTIVE' &&
                        focusedJob.isAllowDriverEditOnApp
                      }
                      keyboardType={'numeric'}
                    />
                    <SpaceView mTop={SIZE1} />
                  </FlexWrap>
                </RowWrap>
                <BorderView
                  color={
                    status === 'ACTIVE' &&
                    options.isRequireBinWeight
                    ? COLORS.BLUE1 : COLORS.GRAY2
                  }
                />
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
              <View>
                <InfoText>tons</InfoText>
                <SpaceView mTop={SIZE1} />
              </View>
            </RowWrap>
            <SpaceView mTop={SIZE2} />

            {
              renderWasteType({
                item: binInfo[binIndex],
                index: binIndex,
                status,
              })
            }
            {
              renderPhotosAndSign({
                item: focusedJob.steps[stepIndex],
                options,
                status,
              })
            }
            {
              renderPayment({
                options,
                status,
              })
            }
            {
              renderCompleteButton({
                status,
              })
            }
          </ContentWrap>
        </BinWrap>
      </View>
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
                  {
                    jobStatus === JOB_STATUS.COMPLETED
                    ? <DeactiveChatIcon />
                    : <ActiveChatIcon />
                  }
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
                {
                  jobStatus === JOB_STATUS.COMPLETED
                  ? <DeactiveDateIcon />
                  : <ActiveDateIcon />
                }
                <SpaceView mLeft={SIZE1} />
                <LabelText>
                  {
                    moment(focusedJob.jobTimeSpecific || focusedJob.jobDate)
                      .format('DD-MMM (ddd)')
                  }
                </LabelText>
                <SpaceView mLeft={SIZE2} />
                {
                  jobStatus === JOB_STATUS.COMPLETED
                  ? <DeactiveTimeIcon />
                  : <ActiveTimeIcon />
                }
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
        disabled={jobStatus === JOB_STATUS.COMPLETED}
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
            {
              jobStatus !== JOB_STATUS.COMPLETED &&
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <BlueRightArrowIcon />
              </RowWrap>
            }
          </RowWrap>
        </ContentWrap>
      </TouchableOpacity>
    );
  };

  const renderHeaderContent = () => {
    // const forToday = getDate() ===
    //   getDate(focusedJob.jobTimeSpecific || focusedJob.jobDate);

    const forToday = true;

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

    if (currentStep === 0.5) {
      return (
        <DefaultButton
          color={
            forToday
            ? COLORS.BLUE1 : COLORS.GRAY3
          }
          text={'Start Job'}
          onPress={
            forToday ? onNextStep : null
          }
          loading={loading}
        />
      );
    }

    if (
      currentStep === 1 ||
      currentStep === 2 ||
      currentStep === 3
    ) {
      return (
        <ScreenText>
          {`Step ${currentStep}/${totalStep}`}
        </ScreenText>
      );
    }

    if (currentStep === 1.5) {
      return (
        <DefaultButton
          color={COLORS.BLUE1}
          text={'In Progress'}
          onPress={onNextStep}
          loading={loading}
        />
      );
    }

    if (currentStep === 3.5) {
      return (
        <DefaultButton
          color={COLORS.GREEN1}
          text={'Complete'}
          onPress={onNextStep}
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
          { renderBinWeight() }
          { renderServices() }
          { renderFailJob() }
          <SpaceView mTop={SIZE2} />
        </ScrollView>
      </Content>

      <ActionSheet
        ref={actionSheetRef}
        title={'Please select one'}
        options={focusedJob.jobPaymentTypeList}
        onPress={(index) => setJobPaymentType(index)}
      />
    </Container>
  );
};

JobDetailsScreenView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  jobStatus: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  amountCollected: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  setAmountCollected: PropTypes.func.isRequired,
  jobPaymentType: PropTypes.number.isRequired,
  setJobPaymentType: PropTypes.func.isRequired,
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
  amountCollected: '',
};

export default JobDetailsScreenView;
