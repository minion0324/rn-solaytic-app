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
  Alert,
  UIManager,
  findNodeHandle,
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
import { getDate, delay } from 'src/utils';

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
  signs,
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
  onBinInput,
}) => {
  const [ actionSheetData, setActionSheetData ] = useState([]);

  let initialStepStatus = jobStatus;
  let initialCurrentStep;

  switch (focusedJob.jobTypeName) {
    case JOB_TYPE.PULL:
      switch (initialStepStatus) {
        case JOB_STATUS.ACKNOWLEDGED:
          initialCurrentStep = 0.5;
          break;
        case JOB_STATUS.STARTED:
          initialCurrentStep = 2;
          break;
        case JOB_STATUS.IN_PROGRESS:
          initialCurrentStep = 3.5;
          break;
        case JOB_STATUS.COMPLETED:
          initialCurrentStep = 4;
          break;
        default:
          initialCurrentStep = 0;
      }
      break;

    case JOB_TYPE.PUT:
      switch (initialStepStatus) {
        case JOB_STATUS.ACKNOWLEDGED:
          initialCurrentStep = 0.5;
          break;
        case JOB_STATUS.STARTED:
          initialCurrentStep = 3.5;
          break;
        case JOB_STATUS.COMPLETED:
          initialCurrentStep = 4;
          break;
        default:
          initialCurrentStep = 0;
      }
      break;

    case JOB_TYPE.EXCHANGE:
      switch (initialStepStatus) {
        case JOB_STATUS.ACKNOWLEDGED:
          initialCurrentStep = 0.5;
          break;
        case JOB_STATUS.STARTED:
          initialCurrentStep = 1.5;
          break;
        case JOB_STATUS.IN_PROGRESS:
          initialCurrentStep = 3;
          break;
        case JOB_STATUS.COMPLETED:
          initialCurrentStep = 4;
          break;
        default:
          initialCurrentStep = 0;
      }
      break;

    case JOB_TYPE.ON_THE_SPOT:
      switch (initialStepStatus) {
        case JOB_STATUS.ACKNOWLEDGED:
          initialCurrentStep = 0.5;
          break;
        case JOB_STATUS.STARTED:
          initialCurrentStep = 2;
          break;
        case JOB_STATUS.IN_PROGRESS:
          initialCurrentStep = 3.5;
          break;
        case JOB_STATUS.COMPLETED:
          initialCurrentStep = 4;
          break;
        default:
          initialCurrentStep = 0;
      }
      break;
  };

  const [ stepStatus, setStepStatus ] = useState(initialStepStatus);
  const [ currentStep, setCurrentStep ] = useState(initialCurrentStep);

  const binIndexRef = useRef(null);
  const actionSheetRef = useRef(null);
  const actionSheetKey = useRef(null);

  const binInfo1Ref = useRef(null);
  const binInfo2Ref = useRef(null);
  const binWeightRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (stepStatus !== jobStatus) {
      setStepStatus(jobStatus);
    }
  }, [jobStatus]);

  useEffect(() => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            setCurrentStep(0.5);
            return;
           case JOB_STATUS.STARTED:
            setCurrentStep(1);
            onScroll(binInfo1Ref);
            return;
          case JOB_STATUS.IN_PROGRESS:
            if (hasBinWeight) {
              setCurrentStep(2);
              onScroll(binWeightRef);
            } else {
              setCurrentStep(3.5);
            }
            return;
          case JOB_STATUS.IN_PROGRESS + STEP_STATUS_MARK:
            setCurrentStep(3.5);
            return;
          case JOB_STATUS.COMPLETED:
            setCurrentStep(4);
            return;
          default:
            setCurrentStep(0);
            return;
        }

      case JOB_TYPE.PUT:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            setCurrentStep(0.5);
            return;
          case JOB_STATUS.ACKNOWLEDGED + STEP_STATUS_MARK:
            if (focusedJob.steps[0].isRequireBinNumberToEnd) {
              console.log('------------- step info');
              console.log(focusedJob.steps[0]);

              onBinInput(0);
            }


            // setCurrentStep(1);
            // onScroll(binInfo1Ref);
            return;
          case JOB_STATUS.STARTED:
            setCurrentStep(3.5);
            return;
          case JOB_STATUS.COMPLETED:
            setCurrentStep(4);
            return;
          default:
            setCurrentStep(0);
            return;
        }

      case JOB_TYPE.EXCHANGE:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            setCurrentStep(0.5);
            return;
          case JOB_STATUS.ACKNOWLEDGED + STEP_STATUS_MARK:
            setCurrentStep(1);
            onScroll(binInfo1Ref);
            return;
          case JOB_STATUS.STARTED:
            setCurrentStep(1.5);
            return;
          case JOB_STATUS.STARTED + STEP_STATUS_MARK:
            setCurrentStep(2);
            onScroll(binInfo2Ref);
            return;
          case JOB_STATUS.IN_PROGRESS:
            if (hasBinWeight) {
              setCurrentStep(3);
              onScroll(binWeightRef);
            } else {
              setCurrentStep(3.5);
            }
            return;
          case JOB_STATUS.IN_PROGRESS + STEP_STATUS_MARK:
            setCurrentStep(3.5);
            return;
          case JOB_STATUS.COMPLETED:
            setCurrentStep(4);
            return;
          default:
            setCurrentStep(0);
            return;
        }

      case JOB_TYPE.ON_THE_SPOT:
        switch (stepStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            setCurrentStep(0.5);
            return;
          case JOB_STATUS.ACKNOWLEDGED + STEP_STATUS_MARK:
            setCurrentStep(1);
            onScroll(binInfo1Ref);
            return;
          case JOB_STATUS.STARTED:
            if (hasBinWeight) {
              setCurrentStep(2);
              onScroll(binWeightRef);
            } else {
              setCurrentStep(1.5);
            }
            return;
          case JOB_STATUS.IN_PROGRESS:
            setCurrentStep(3.5);
            return;
          case JOB_STATUS.COMPLETED:
            setCurrentStep(4);
            return;
          default:
            setCurrentStep(0);
            return;
        }

      default:
        setCurrentStep(0);
        return;
    };
  }, [
    stepStatus,
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

  const hasBinWeight = useMemo(() => {
    const { stepIndex } = binWeightIndexes;

    if (stepIndex === -1) {
      return false;
    }

    return focusedJob.steps[stepIndex].isRequireBinWeight;
  }, [
    binWeightIndexes,
  ]);

  const totalStep = useMemo(() => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        return hasBinWeight ? 2 : 1;

      case JOB_TYPE.PUT:
        return hasBinWeight ? 1 : 1;

      case JOB_TYPE.EXCHANGE:
        return hasBinWeight ? 3 : 2;

      case JOB_TYPE.ON_THE_SPOT:
        return hasBinWeight ? 2 : 1;

      default:
        return hasBinWeight ? 2 : 1;
    };
  }, [
    hasBinWeight,
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
        'numberofPhotosRequired',
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

  const onValidateStep = (stepIndex, binIndex) => {
    const { jobStepId } = focusedJob.steps[stepIndex];
    const options = getBinInfoOptions(stepIndex);

     if (
       options.isRequireBinNumberToEnd &&
       !binInfo[binIndex]['binNumber']
     ) {
      Alert.alert('Warning', 'Please insert bin number');
      return false;
     }

     if (
      options.isRequireBinType &&
      !(
        binInfo[binIndex]['binType'] &&
        binInfo[binIndex]['binType']['binTypeName']
      )
     ) {
      Alert.alert('Warning', 'Please insert bin type');
      return false;
     }

     if (
      options.isRequireBinWeight &&
      !binInfo[binIndex]['binWeight']
     ) {
      Alert.alert('Warning', 'Please insert bin weight');
      return false;
     }

     if (
      binInfo[binIndex]['binWeight'] &&
      binInfo[binIndex]['binWeight'] > 99.999
     ) {
      Alert.alert('Warning', 'The max value for bin weight is 99.999');
      return false;
     }

     if (
      options.isRequireReviewWasteType &&
      !binInfo[binIndex]['wasteTypes'].length
     ) {
      Alert.alert('Warning', 'Please insert waste type(s)');
      return false;
     }

     if (
      options.numberofPhotosRequired &&
      photos.filter((photo) => (
        photo.jobStepId === jobStepId
      )).length !== options.numberofPhotosRequired
     ) {
      Alert.alert('Warning', `Please include ${options.numberofPhotosRequired} photo(s)`);
      return false;
     }

     if (
      options.mustTakeSignature &&
      signs.findIndex((sign) => (
        sign.jobStepId === jobStepId
      )) === -1
     ) {
      Alert.alert('Warning', 'Please include signature');
      return false;
     }

     if (
      options.isRequirePaymentCollection &&
      !amountCollected
     ) {
      Alert.alert('Warning', 'Please insert collect payment');
      return false;
     }

     return true;
  };

  const onNextStep = () => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        if (currentStep === 0.5) {
          onStart();
        } else if (currentStep === 1) {
          onValidateStep(0, 0) && onPull();
        } else if (currentStep === 2) {
          setStepStatus(jobStatus + STEP_STATUS_MARK);
        } else if (currentStep === 3.5) {
          onComplete();
        }
        return;

      case JOB_TYPE.PUT:
        if (currentStep === 0.5) {
          setStepStatus(jobStatus + STEP_STATUS_MARK);
        } else if (currentStep === 1) {
          onValidateStep(0, 0) && onStart();
        } else if (currentStep === 3.5) {
          onComplete();
        }
        return;

      case JOB_TYPE.EXCHANGE:
        if (currentStep === 0.5) {
          setStepStatus(jobStatus + STEP_STATUS_MARK);
        } else if (currentStep === 1) {
          onValidateStep(0, 0) && onStart();
        } else if (currentStep === 1.5) {
          setStepStatus(jobStatus + STEP_STATUS_MARK);
        } else if (currentStep === 2) {
          onValidateStep(1, 1) && onExchange();
        } else if (currentStep === 3) {
          const { stepIndex, binIndex } = binWeightIndexes;
          onValidateStep(stepIndex, binIndex) &&
          setStepStatus(jobStatus + STEP_STATUS_MARK);
        } else if (currentStep === 3.5) {
          onComplete();
        }
        return;

      case JOB_TYPE.ON_THE_SPOT:
        case JOB_TYPE.PULL:
          if (currentStep === 0.5) {
            setStepStatus(jobStatus + STEP_STATUS_MARK);
          } else if (currentStep === 1) {
            onValidateStep(0, 0) && onStart();
          } else if (currentStep === 1.5 || currentStep === 2) {
            onExchange();
          } else if (currentStep === 3.5) {
            onComplete();
          }
        return;

      default:
        return;
    };
  };

  const onScroll = async (ref) => {
    try {
      await delay(100);

      UIManager.measureLayoutRelativeToParent(
        findNodeHandle(ref.current),
        () => {},
        (x, y) => {
          scrollRef.current.scrollTo({ x: 0, y: y });
        },
      );
    } catch (error) {
      //
    }
  };

  const onUpdateBinInfo = (binIndex, newInfo) => {
    const newBinInfo = binInfo.slice(0);

    newBinInfo[binIndex] = {
      ...newBinInfo[binIndex],
      ...newInfo,
    };

    setBinInfo(newBinInfo);
  };

  const onShowActionSheetForBinType = (binIndex) => {
    const { charges } = focusedJob;

    if (charges.length === 0) {
      Alert.alert('Warning', 'The customer has no Bin Type.');
      return;
    }

    const data = charges
      .map(charge => charge['binType']['binTypeName']);

    setActionSheetData(data);

    binIndexRef.current = binIndex;
    actionSheetKey.current = 'binType';
    actionSheetRef.current.show();
  };

  const onShowActionSheetForPaymentType = () => {
    setActionSheetData(focusedJob.jobPaymentTypeList);

    actionSheetKey.current = 'paymentType';
    actionSheetRef.current.show();
  };

  const onActionSheetPress = (index) => {
    if (index === actionSheetData.length) {
      return;
    }

    if (actionSheetKey.current === 'binType') {
      const { charges } = focusedJob;

      onUpdateBinInfo(binIndexRef.current, {
        binType: charges[index].binType,
        wasteType: charges[index].wasteType,
      });
    } else {
      setJobPaymentType(index);
    }
  };

  const onShowPhotoModal = (selectedPhoto, isEditable) => {
    showLightBox(CUSTOM_MODAL_SCREEN, {
      props: { selectedPhoto, isEditable },
      getContent: renderPhotoModal,
    });
  };

  const renderPhotoModal = (containerId, { selectedPhoto, isEditable }) => {
    return (
      <PhotoWrap>
        <FullImage
          source={{ uri: selectedPhoto.uri }}
        />
        {
          isEditable &&
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
        }
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
    const selectedServices = services.filter(item => item.isSelected);

    if (
      jobStatus === JOB_STATUS.COMPLETED &&
      selectedServices.length === 0
    ) {
      return null;
    }

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity
          disabled={!isInProgress}
          onPress={onAddServices}
        >
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
          selectedServices.length > 0 &&
          <View>
            <BorderView
              mLeft={SIZE2} mRight={SIZE2}
            />
            <TouchableOpacity
              disabled={!isInProgress}
              onPress={onAddServices}
            >
              <ContentWrap>
                {
                  selectedServices.map((item, index) => (
                    <View
                      key={`${item.serviceAdditionalChargeTemplateId}`}
                    >
                      {
                        index > 0 &&
                        <SpaceView mTop={SIZE1} />
                      }
                      <RowWrap>
                        <FlexWrap>
                          <InfoText>
                            {item.serviceAdditionalChargeName}
                          </InfoText>
                        </FlexWrap>
                        <SpaceView mLeft={SIZE2} />
                        <InfoText>
                          {item.quantity}
                        </InfoText>
                      </RowWrap>
                    </View>
                  ))
                }
              </ContentWrap>
            </TouchableOpacity>
          </View>
        }
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
            {
              options.isRequireBinNumberToEnd &&
              <RowWrap>
                <SpaceView mLeft={SIZE3} />
                {
                  item['binNumber']
                  ? <GreenActiveCircleCheckIcon />
                  : <DeactiveCircleCheckIcon />
                }
              </RowWrap>
            }
          </RowWrap>
        }
      </RowWrap>
      <BorderView
        color={
          status === 'ACTIVE' &&
          focusedJob.isAllowDriverEditOnApp
          ? COLORS.BLUE1 : COLORS.GRAY2
        }
      />
      <SpaceView mTop={SIZE2} />
    </View>
  );

  const renderBinType = ({
    item,
    index,
    idx,
    status,
  }) => (
      item['binType'] &&
      item['binType']['binTypeName'] &&
      <View>
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <FlexWrap>
            <LabelText>Bin Type</LabelText>
            <TouchableOpacity
              disabled={
                !(
                  status === 'ACTIVE' &&
                  focusedJob.isAllowDriverEditOnApp &&
                  (
                    idx === 1 &&
                    focusedJob.isEditableBinTypeOut
                  )
                )
              }
              onPress={() => onShowActionSheetForBinType(index)}
            >
              <InfoText>
                {
                  item['binType'] &&
                  item['binType']['binTypeName']
                }
              </InfoText>
            </TouchableOpacity>
          </FlexWrap>
        </RowWrap>
        <SpaceView mTop={SIZE2} />
      </View>
  );

  const renderWasteType = ({
    item,
    index,
    idx,
    options,
    status,
  }) => (
    options.isRequireReviewWasteType &&
    <View>
      <SpaceView mTop={SIZE2} />
      <RowWrap>
        <FlexWrap>
          <LabelText>
            {
              idx === 1
              ? 'For Waste Type'
              : 'With Waste Type'
            }
          </LabelText>
          <TouchableOpacity
            disabled={
              !(
                status === 'ACTIVE' &&
                focusedJob.isAllowDriverEditOnApp &&
                (
                  (idx !== 1 && focusedJob.isEditableWasteTypeIn) ||
                  (idx === 1 && focusedJob.isEditableWasteTypeOut)
                )
              )
            }
            onPress={() => onAddWasteTypes(index, idx)}
          >
            {
              item['wasteTypes'].map((el, i) => (
                <View key={el.wasteTypeId}>
                  {
                    i > 0 &&
                    <SpaceView mTop={SIZE1} />
                  }
                  <InfoText>
                    {el.wasteType.wasteTypeName || ''}
                  </InfoText>
                </View>
              ))
            }
          </TouchableOpacity>
        </FlexWrap>
        {
          status === 'ACTIVE' &&
          focusedJob.isAllowDriverEditOnApp &&
          (
            (idx !== 1 && focusedJob.isEditableWasteTypeIn) ||
            (idx === 1 && focusedJob.isEditableWasteTypeOut)
          ) &&
          <TouchableOpacity
            onPress={() => onAddWasteTypes(index, idx)}
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
          status === 'ACTIVE' &&
          focusedJob.isAllowDriverEditOnApp &&
          (
            (idx !== 1 && focusedJob.isEditableWasteTypeIn) ||
            (idx === 1 && focusedJob.isEditableWasteTypeOut)
          )
          ? COLORS.BLUE1 : COLORS.GRAY2
        }
      />
      <SpaceView mTop={SIZE2} />
    </View>
  );

  const renderPhoto = ({
    item,
    status,

    photoIndex: index,
  }) => {
    const data = photos.filter((photo) => (
      photo.jobStepId === item.jobStepId
    ));

    return (
      [
        <FlexWrap
          key={`${index}-Photos-FlexWrap`}
          flex={2}
        >
          {
            data[index]
            ? <TouchableOpacity
                onPress={() => onShowPhotoModal(
                  data[index],
                  status === 'ACTIVE',
                )}
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
          key={`${index}-Photos-SpaceView`}
          mLeft={SIZE2}
        />
      ]
    );
  };

  const renderSign = ({
    item,
    status,
  }) => {
    const index = signs.findIndex((sign) => (
      sign.jobStepId === item.jobStepId
    ));

    return (
      index !== -1
      ? <TouchableOpacity
          onPress={() => onSign(item.jobStepId)}
          disabled={status !== 'ACTIVE'}
        >
          <SignWrap>
            <FullImage source={{ uri: signs[index].uri }} />
          </SignWrap>
        </TouchableOpacity>
      : <TouchableOpacity
          onPress={() => onSign(item.jobStepId)}
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
    );
  };

  const renderPhotosAndSign = ({
    item,
    options,
    status,
  }) => (
    (
      options.numberofPhotosRequired ||
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
            {
              (
                !options.numberofPhotosRequired ||
                (
                  options.numberofPhotosRequired &&
                  photos.filter((photo) => (
                    photo.jobStepId === item.jobStepId
                  )).length === options.numberofPhotosRequired
                )
              ) && (
                !options.mustTakeSignature ||
                (
                  options.mustTakeSignature &&
                  signs.findIndex((sign) => (
                    sign.jobStepId === item.jobStepId
                  )) !== -1
                )
              )
              ? <GreenActiveCircleCheckIcon />
              : <DeactiveCircleCheckIcon />
            }
          </RowWrap>
        }
      </RowWrap>
      <SpaceView mTop={SIZE4} />
      <RowWrap>
        {
          !!options.numberofPhotosRequired &&
          Array(options.numberofPhotosRequired)
            .fill(0)
            .map((empty, index) => (
              renderPhoto({
                item,
                status,

                photoIndex: index,
              })
            ))
        }
        {
          <FlexWrap flex={3}>
            {
              options.mustTakeSignature &&
              renderSign({
                item,
                status,
              })
            }
          </FlexWrap>
        }
        {
          (options.numberofPhotosRequired || 0) < 2 &&
          Array(2 - (options.numberofPhotosRequired || 0))
            .fill(0)
            .map((empty, index) => (
              [
                <SpaceView
                  key={`${index}-Empty-SpaceView`}
                  mLeft={SIZE2}
                />
                ,
                <FlexWrap
                  key={`${index}-Empty-FlexWrap`}
                  flex={2}
                />
              ]
            ))
        }
      </RowWrap>
      <SpaceView mTop={SIZE4} />
    </View>
  );

  const renderPayment = ({
    index,
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
                  focusedJob.steps[index].amountToCollect
                  ? `: $${focusedJob.steps[index].amountToCollect} ` +
                    focusedJob.jobPaymentTypeList[
                      focusedJob.steps[index].jobPaymentType
                    ]
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
          <BorderView
            color={
              status === 'ACTIVE' &&
              focusedJob.isAllowDriverEditOnApp
              ? COLORS.BLUE1 : COLORS.GRAY2
            }
          />
        </FlexWrap>
        <SpaceView mLeft={SIZE4} />
        <FlexWrap>
          <TouchableOpacity
            onPress={onShowActionSheetForPaymentType}
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
              {
                status === 'ACTIVE' &&
                <RowWrap>
                  <SpaceView mLeft={SIZE1} />
                  <DropdownArrowIcon />
                </RowWrap>
              }
              <SpaceView mLeft={SIZE1} />
            </RowWrap>
          </TouchableOpacity>
          <SpaceView mTop={SIZE1} />
          <BorderView
            color={
              status === 'ACTIVE' &&
              focusedJob.isAllowDriverEditOnApp
              ? COLORS.BLUE1 : COLORS.GRAY2
            }
          />
        </FlexWrap>
      </RowWrap>
      <SpaceView mTop={SIZE4} />
    </View>
  );

  const renderCompleteButton = ({
    status,
  }) => (
    !JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus) &&
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

        if (
          idx !== 0 && idx !== 1 &&
          index === binWeightIndexes.stepIndex
        ) {
          return null;
        }

        return (
          <View
            ref={index === 0 ? binInfo1Ref : binInfo2Ref}
            key={`${item.jobStepId}`}
          >
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
                    index,
                    idx,
                    status,
                  })
                }
                {
                  renderWasteType({
                    item,
                    index,
                    idx,
                    options,
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
                    index,
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

    const idx = getBinInOutInfoIndex(stepIndex);
    const options = getBinInfoOptions(stepIndex);
    const status = getBinInfoStatus(stepIndex);

    if (
      !hasBinWeight ||
      status === 'NOT_STARTED'
    ) {
      return null;
    }

    return (
      <View
        ref={binWeightRef}
      >
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
                options.isRequireBinWeight &&
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
                    focusedJob.isAllowDriverEditOnApp
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
                idx,
                options,
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
    if (
      jobStatus === JOB_STATUS.COMPLETED &&
      focusedJob.messages.length === 0
    ) {
      return null;
    }

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
            <FlexWrap>
              <TitleText>
                {
                  (focusedJob.jobTemplateName || focusedJob.jobTypeName)
                    .toUpperCase()
                }
              </TitleText>
            </FlexWrap>
            <SpaceView mLeft={SIZE2} />
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
          ref={scrollRef}
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
        options={[ ...actionSheetData, 'Cancel' ]}
        cancelButtonIndex={actionSheetData.length}
        onPress={onActionSheetPress}
      />
    </Container>
  );
};

JobDetailsScreenView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  signs: PropTypes.array.isRequired,
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
  onBinInput: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  amountCollected: '',
};

export default JobDetailsScreenView;
