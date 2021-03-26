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
import {
  getDate,
  delay,
  getCustomerSiteAddress,
} from 'src/utils';

import {
  Container,
  Content,
  ContentWrap,
  ShadowWrap,
  FullImage,
  RowWrap,
  FlexWrap,
  SpaceView,
  BorderDash,
  CenteredWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  Back,
  Help,
} from 'src/styles/header.styles';
import {
  TitleText,
  InfoText,
  LabelText,
} from 'src/styles/text.styles';

import {
  DriverMessageBadge,
  BinInput,
  BinInputWrap,
  ServicesWrap,
  PhotoWrap,
  SignWrap,
  PhotoModalButtonsWrap,
  PrintReceiptButton,
} from './styled';

const {
  BlackRightArrowIcon,
  DateIcon,
  TimeIcon,
  BinInIcon,
  BinOutIcon,
  ActiveScanCodeIcon,
  DeactiveScanCodeIcon,
  BlackActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
  ActivePrintIcon,
  DeactivePrintIcon,
  ActivePhotoAddIcon,
  DeactivePhotoAddIcon,
  ActiveSignAddIcon,
  DeactiveSignAddIcon,
  BinIcon,
  DeletePhotoIcon,
  BackPhotoIcon,
  BinWeightIcon,
  DropdownArrowIcon,
  CircleAddIcon,
} = SVGS;

const SPECIAL = 'SPECIAL';

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
  onShift,
  onExchange,
  onComplete,
  onPhoto,
  onSign,
  onCancelPhoto,
  onFail,
  onAddress,
  onDriverMessage,
  onAddServices,
  onAddWasteTypes,
  onScanCode,
  onPrint,
}) => {
  const [ actionSheetData, setActionSheetData ] = useState([]);

  const binIndexRef = useRef(null);
  const actionSheetRef = useRef(null);
  const actionSheetKey = useRef(null);

  const binInfoRefs = useRef({});
  const binIdRefs = useRef({});
  const binTypeRefs = useRef({});
  const wasteTypeRefs = useRef({});
  const photosAndSignatureRefs = useRef({});
  const paymentCollectionRefs = useRef({});

  const scrollRef = useRef(null);

  const stepIndexForBinWeight = useRef(
    focusedJob.jobTypeName === JOB_TYPE.EXCHANGE
    ? 2
    : (
      focusedJob.jobTypeName === JOB_TYPE.PULL ||
      focusedJob.jobTypeName === JOB_TYPE.ON_THE_SPOT
    ) ? 1 : -1
  );

  const stepIndexForOthers = useRef(
    focusedJob.jobTypeName === JOB_TYPE.EXCHANGE
    ? 1
    : (
      focusedJob.jobTypeName === JOB_TYPE.PULL ||
      focusedJob.jobTypeName === JOB_TYPE.SHIFT ||
      focusedJob.jobTypeName === JOB_TYPE.PUT ||
      focusedJob.jobTypeName === JOB_TYPE.ON_THE_SPOT
    ) ? 0 : -1
  );

  const jobDateList = useRef(
    focusedJob.jobTypeName === JOB_TYPE.PULL ||
    focusedJob.jobTypeName === JOB_TYPE.SHIFT ||
    focusedJob.jobTypeName === JOB_TYPE.ON_THE_SPOT
    ? [
        [
          { label: 'Started', field: 'startedDate' },
          { label: 'In Progress', field: 'inProgressDate' },
        ],
        [{ label: 'Completed', field: 'completedDate' }],
      ]
    : focusedJob.jobTypeName === JOB_TYPE.EXCHANGE
      ? focusedJob.steps[stepIndexForBinWeight.current].isRequireBinWeight
        ? [
            [{ label: 'Started', field: 'startedDate' }],
            [{ label: 'In Progress', field: 'inProgressDate' }],
            [{ label: 'Completed', field: 'completedDate' }],
          ]
        : [
            [{ label: 'Started', field: 'startedDate' }],
            [
              { label: 'In Progress', field: 'inProgressDate' },
              { label: 'Completed', field: 'completedDate' },
            ],
          ]
      : null
  );

  const isCompletedJobState = useMemo(() => {
    if (
      jobStatus === JOB_STATUS.COMPLETED ||
      jobStatus === JOB_STATUS.FAILED
    ) {
      return true;
    }

    return false;
  }, [
    jobStatus,
    focusedJob.jobTypeName,
  ]);

  const currentStepIndex = useMemo(() => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
      case JOB_TYPE.SHIFT:
        switch (jobStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            return -1;
           case JOB_STATUS.STARTED:
            return 0;
          case JOB_STATUS.IN_PROGRESS:
            return 1;
          case JOB_STATUS.COMPLETED:
            return 3;
          default:
            return -1;
        }

      case JOB_TYPE.PUT:
      case JOB_TYPE.ON_THE_SPOT:
        switch (jobStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            return SPECIAL;
          case JOB_STATUS.STARTED:
            return 0;
          case JOB_STATUS.IN_PROGRESS:
            return 1;
          case JOB_STATUS.COMPLETED:
            return 3;
          default:
            return -1;
        }

      case JOB_TYPE.EXCHANGE:
        switch (jobStatus) {
          case JOB_STATUS.ACKNOWLEDGED:
            return 0;
          case JOB_STATUS.STARTED:
            return 1;
          case JOB_STATUS.IN_PROGRESS:
            return 2;
          case JOB_STATUS.COMPLETED:
            return 3;
          default:
            return -1;
        }

      default:
        return -1;
    };
  }, [
    jobStatus,
    focusedJob.jobTypeName,
  ]);

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

  const getJobStepPhotos = useCallback(
    (jobStepId) => (
      photos.filter((photo) => (
        photo.jobStepId === jobStepId
      ))
    ),
    [photos],
  );

  const getJobStepSigns = useCallback(
    (jobStepId) => (
      signs.filter((sign) => (
        sign.jobStepId === jobStepId
      ))
    ),
    [signs],
  );

  const validationCurrentStep = useMemo(() => {
    if (
      currentStepIndex === -1 ||
      currentStepIndex === 3
    ) {
      return { hard: '', easy: '', ref: null };
    }

    const stepIndex = currentStepIndex === SPECIAL
      ? 0 : currentStepIndex;
    const binIndex = stepIndex === stepIndexForBinWeight.current
      ? stepIndex - 1 : stepIndex;

    const { jobStepId } = focusedJob.steps[stepIndex];

    const options = currentStepIndex === SPECIAL
      ? pick(
          focusedJob.steps[stepIndex],
          [
            'isRequireBinNumberToEnd',
            'isRequireBinNumberToStart',
          ],
        )
      : getBinInfoOptions(stepIndex);

    if (
      options.isRequireBinNumberToEnd &&
      !binInfo[binIndex]['binNumber']
    ) {
      const text = 'Please insert bin number';
      return { hard: text, easy: text, ref: binIdRefs.current[stepIndex] };
    }

    if (
      options.isRequireBinType &&
      !(
        binInfo[binIndex]['binType'] &&
        binInfo[binIndex]['binType']['binTypeName']
      )
    ) {
      const text = 'Please insert bin type';
      return { hard: text, easy: text, ref: binTypeRefs.current[stepIndex] };
    }

    if (
      options.isRequireBinWeight &&
      !binInfo[binIndex]['binWeight']
    ) {
      const text = 'Please insert bin weight';
      return { hard: text, easy: text, ref: binInfoRefs.current[stepIndexForBinWeight.current] };
    }

    if (
      binInfo[binIndex]['binWeight'] &&
      binInfo[binIndex]['binWeight'] > 99.999
    ) {
      const text = 'The max value for bin weight is 99.999';
      return { hard: text, easy: '', ref: null };
    }

    if (
      options.isRequireReviewWasteType &&
      !binInfo[binIndex]['wasteTypes'].length
    ) {
      const text = 'Please insert waste type(s)';
      return { hard: text, easy: text, ref: wasteTypeRefs.current[stepIndex] };
    }

    if (
      options.mustTakePhoto === 1 &&
      getJobStepPhotos(jobStepId).length !== options.numberofPhotosRequired
    ) {
      const text = `Please include ${options.numberofPhotosRequired} photo(s)`;
      return { hard: text, easy: text, ref: photosAndSignatureRefs.current[stepIndex] };
    }

    if (
      options.mustTakeSignature === 1 &&
      getJobStepSigns(jobStepId).length !== 1
    ) {
      const text = 'Please include signature';
      return { hard: text, easy: text, ref: photosAndSignatureRefs.current[stepIndex] };
    }

    if (
      options.isRequirePaymentCollection &&
      !amountCollected
    ) {
      const text = 'Please insert collect payment';
      return { hard: text, easy: text, ref: paymentCollectionRefs.current[stepIndex] };
    }

    return { hard: '', easy: '', ref: null };
  }, [
    binInfo,
    photos,
    signs,
    amountCollected,
    focusedJob.steps,
    currentStepIndex,
  ]);

  useEffect(() => {
    switch (currentStepIndex) {
      case SPECIAL:
      case 0:
        onScroll(binInfoRefs.current[0]);
        return;
      case 1:
        onScroll(binInfoRefs.current[1]);
        return;
      case 2:
        onScroll(binInfoRefs.current[2]);
        return;
    }
  }, [currentStepIndex]);

  const getBinInOutInfoIndex = useCallback(
    (index) => {
      switch (focusedJob.jobTypeName) {
        case JOB_TYPE.PULL:
          return index === 0 ? 0 : -1;

        case JOB_TYPE.SHIFT:
        case JOB_TYPE.EXCHANGE:
          return index === 0 ? 1 : 0;

        case JOB_TYPE.PUT:
          return index === 0 ? 1 : -1;

        default:
          return -1;
      };
    },
    [focusedJob.jobTypeName],
  );

  const getCustomerSiteIndex = useCallback(
    () => {
      switch (focusedJob.jobTypeName) {
        case JOB_TYPE.PULL:
        case JOB_TYPE.SHIFT:
          return 0;

        case JOB_TYPE.PUT:
        case JOB_TYPE.EXCHANGE:
        case JOB_TYPE.ON_THE_SPOT:
          return 1;

        default:
          return 0;
      };
    },
    [focusedJob.jobTypeName],
  );

  const getBinInfoStatus = useCallback(
    (index) => {
      if (currentStepIndex === SPECIAL) {
        return SPECIAL;
      } else if (currentStepIndex < index) {
        return 'NOT_STARTED';
      } else if (currentStepIndex === index) {
        return 'ACTIVE';
      } else {
        return 'COMPLETED';
      }
    },
    [currentStepIndex],
  );

  const onValidate = (action) => {
     if (validationCurrentStep.hard) {
      Alert.alert('Warning', validationCurrentStep.hard);
      return false;
     }

     action();
  };

  const onScroll = async (ref) => {
    try {
      if (!ref) {
        return;
      }

      await delay(100);

      ref.measureLayout(
        findNodeHandle(scrollRef.current),
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

  const renderBinNumber = ({
    item,
    index,
    options,
    status,

    isSpecial,
  }) => {
    const enabled =
      (
        status === 'ACTIVE' ||
        (index === 0 && status === SPECIAL)
      ) &&
      focusedJob.isAllowDriverEditOnApp;

    return (
      <View
        ref={ref => binIdRefs.current[index] = ref}
      >
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          {
            !isCompletedJobState
            ? !isSpecial &&
              <FlexWrap>
                <RowWrap>
                  <LabelText>Bin ID</LabelText>
                  {
                    status !== 'COMPLETED' &&
                    options.isRequireBinNumberToEnd &&
                    <RowWrap>
                      <SpaceView mLeft={SIZE1} />
                      {
                        item['binNumber']
                        ? <BlackActiveCircleCheckIcon />
                        : <DeactiveCircleCheckIcon />
                      }
                    </RowWrap>
                  }
                </RowWrap>
                <SpaceView mTop={SIZE1} />
                <BinInputWrap
                  color={
                    enabled
                    ? COLORS.BLUE1 : COLORS.TRANSPARENT1
                  }
                  effect={!isCompletedJobState}
                >
                  <BinInput
                    underlineColorAndroid={COLORS.TRANSPARENT1}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    value={`${item['binNumber'] || ''}`}
                    onChangeText={(text) =>
                      onUpdateBinInfo(index, { binNumber: text })
                    }
                    editable={enabled}
                  />
                  {
                    status !== 'COMPLETED' &&
                    <RowWrap>
                      <SpaceView mLeft={SIZE3} />
                      <TouchableOpacity
                        disabled={!enabled}
                        onPress={() => onScanCode(index)}
                      >
                        {
                          enabled
                          ? <ActiveScanCodeIcon />
                          : <DeactiveScanCodeIcon />
                        }
                      </TouchableOpacity>
                    </RowWrap>
                  }
                </BinInputWrap>
              </FlexWrap>
            : [
                !isSpecial &&
                <FlexWrap key={'Bin-Id'}>
                  <LabelText>Bin ID</LabelText>
                  <SpaceView mTop={SIZE1} />
                  <InfoText>
                    {item['binNumber'] || ' --- '}
                  </InfoText>
                </FlexWrap>,

                jobDateList.current &&
                jobDateList.current[index].length !== 0 &&
                jobDateList.current[index].map((el) => (
                  !!focusedJob[el.field] &&
                  <FlexWrap key={el.label}>
                    <LabelText>{el.label}</LabelText>
                    <SpaceView mTop={SIZE1} />
                    <InfoText>
                      {moment(focusedJob[el.field]).format('hh:mm A')}
                    </InfoText>
                  </FlexWrap>
                ))
              ]
          }
        </RowWrap>
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderBinType = ({
    item,
    index,
    idx,
    status,
  }) => {
    if (
      !item['binType'] ||
      !item['binType']['binTypeName']
    ) {
      return null;
    }

    const enabled =
      status === 'ACTIVE' &&
      focusedJob.isAllowDriverEditOnApp &&
      (
        idx === 1 &&
        focusedJob.isEditableBinTypeOut
      );

    return (
      <View
        ref={ref => binTypeRefs.current[index] = ref}
      >
        <SpaceView mTop={SIZE2} />
        <LabelText>Bin Type</LabelText>
        <SpaceView mTop={SIZE1} />
        <TouchableOpacity
          disabled={!enabled}
          onPress={() => onShowActionSheetForBinType(index)}
        >
          <InfoText>
            {item['binType']['binTypeName']}
          </InfoText>
        </TouchableOpacity>
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderWasteType = ({
    item,
    index,
    idx,
    options,
    status,

    stepIndex = null,
  }) => {
    if (!options.isRequireReviewWasteType) {
      return null;
    }

    const editable =
      status === 'ACTIVE' &&
      focusedJob.isAllowDriverEditOnApp &&
      (
        (idx !== 1 && focusedJob.isEditableWasteTypeIn) ||
        (idx === 1 && focusedJob.isEditableWasteTypeOut)
      );

    return (
      <View
        ref={ref => wasteTypeRefs.current[stepIndex || index] = ref}
      >
        <SpaceView mTop={SIZE2} />
        <LabelText>
          {
            idx === 1
            ? 'For Waste Type'
            : 'With Waste Type'
          }
        </LabelText>
        <SpaceView mTop={SIZE1} />
        <BinInputWrap
          color={
            editable
            ? COLORS.BLUE1 : COLORS.TRANSPARENT1
          }
          effect={!isCompletedJobState}
        >
          <FlexWrap>
            <TouchableOpacity
              disabled={!editable}
              onPress={() => onAddWasteTypes(index, idx)}
            >
              <RowWrap>
                <FlexWrap>
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
                </FlexWrap>
                {
                  editable &&
                  <RowWrap>
                    <SpaceView mLeft={SIZE2} />
                    <BlackRightArrowIcon />
                  </RowWrap>
                }
              </RowWrap>
            </TouchableOpacity>
          </FlexWrap>
        </BinInputWrap>
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderPhoto = ({
    item,
    status,

    photoIndex: index,
  }) => {
    const data = getJobStepPhotos(item.jobStepId)[index];

    return (
      [
        <FlexWrap
          key={`${index}-Photos-FlexWrap`}
          flex={2}
        >
          {
            data
            ? <TouchableOpacity
                onPress={() => onShowPhotoModal(
                  data,
                  status === 'ACTIVE',
                )}
              >
                <PhotoWrap>
                  <FullImage source={{ uri: data.uri }} />
                </PhotoWrap>

              </TouchableOpacity>
            : <TouchableOpacity
                onPress={() => onPhoto(item.jobStepId)}
                disabled={status !== 'ACTIVE'}
              >
                <PhotoWrap>
                  <BorderDash
                    dashGap={5}
                    dashLength={5}
                    dashThickness={1}
                    color={
                      status === 'ACTIVE'
                      ? COLORS.BLUE1 : COLORS.GRAY3
                    }
                  />
                  {
                    status === 'ACTIVE'
                    ? <ActivePhotoAddIcon />
                    : <DeactivePhotoAddIcon />
                  }
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
    const data = getJobStepSigns(item.jobStepId)[0];

    return (
      data
      ? <TouchableOpacity
          onPress={() => onSign(item.jobStepId)}
          disabled={status !== 'ACTIVE'}
        >
          <SignWrap>
            <FullImage source={{ uri: data.uri }} />
          </SignWrap>
        </TouchableOpacity>
      : <TouchableOpacity
          onPress={() => onSign(item.jobStepId)}
          disabled={status !== 'ACTIVE'}
        >
          <SignWrap>
            <BorderDash
              dashGap={5}
              dashLength={5}
              dashThickness={1}
              color={
                status === 'ACTIVE'
                ? COLORS.GREEN1 : COLORS.GRAY3
              }
            />
            {
              status === 'ACTIVE'
              ? <ActiveSignAddIcon />
              : <DeactiveSignAddIcon />
            }
          </SignWrap>
        </TouchableOpacity>
    );
  };

  const renderPhotosAndSign = ({
    item,
    index,
    options,
    status,
  }) => {
    const numberOfPhotos = isCompletedJobState
      ? getJobStepPhotos(item.jobStepId).length
      : options.mustTakePhoto === 0
        ? 0 : options.numberofPhotosRequired;

    const numberOfSigns = isCompletedJobState
      ? getJobStepSigns(item.jobStepId).length
      : options.mustTakeSignature === 0 ? 0 : 1;

    if (numberOfPhotos === 0 && numberOfSigns === 0) {
      return null;
    }

    return (
      <View
        ref={ref => photosAndSignatureRefs.current[index] = ref}
      >
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <LabelText>
            {
              numberOfPhotos === 0
              ? 'Signature'
              : numberOfSigns === 0
                ? 'Photos' : 'Photos & Signature'
            }
          </LabelText>
          {
            status !== 'COMPLETED' &&
            <RowWrap>
              <SpaceView mLeft={SIZE1} />
              {
                (
                  options.mustTakePhoto !== 1 ||
                  (
                    options.mustTakePhoto === 1 &&
                    getJobStepPhotos(item.jobStepId)
                      .length === options.numberofPhotosRequired
                  )
                ) && (
                  options.mustTakeSignature !== 1 ||
                  (
                    options.mustTakeSignature === 1 &&
                    getJobStepSigns(item.jobStepId).length === 1
                  )
                )
                ? <BlackActiveCircleCheckIcon />
                : <DeactiveCircleCheckIcon />
              }
            </RowWrap>
          }
        </RowWrap>
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          {
            Array(numberOfPhotos)
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
                numberOfSigns !== 0 &&
                renderSign({
                  item,
                  status,
                })
              }
            </FlexWrap>
          }
          {
            Array(2 - numberOfPhotos)
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
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderAdditionalServices = ({
    index,
    status,
  }) => {
    if (stepIndexForOthers.current !== index) {
      return null;
    }

    const selectedServices = services.filter(item => item.isSelected);

    if (
      jobStatus === JOB_STATUS.COMPLETED &&
      selectedServices.length === 0
    ) {
      return null;
    }

    const editable =
      status === 'ACTIVE' &&
      focusedJob.isAllowDriverEditOnApp;

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        {
          isCompletedJobState
          ? <RowWrap>
              <FlexWrap>
                <LabelText>
                  Additional services
                </LabelText>
              </FlexWrap>
              <LabelText>Qty</LabelText>
            </RowWrap>
          : <TouchableOpacity
              disabled={!editable}
              onPress={onAddServices}
            >
              <RowWrap>
                <FlexWrap>
                  <RowWrap>
                    <CircleAddIcon />
                    <SpaceView mLeft={SIZE1} />
                    <InfoText>Additional services</InfoText>
                  </RowWrap>
                </FlexWrap>
                {
                  editable &&
                  <RowWrap>
                    <SpaceView mLeft={SIZE2} />
                    <BlackRightArrowIcon />
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                }
              </RowWrap>
            </TouchableOpacity>
        }
        <SpaceView mTop={SIZE2} />
        {
          selectedServices.length > 0 &&
          <ServicesWrap
            effect={!isCompletedJobState}
          >
            {
              selectedServices.map((item, index) => (
                <FlexWrap
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
                </FlexWrap>
              ))
            }
          </ServicesWrap>
        }
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderCollections = ({
    index,
    options,
    status,
  }) => {
    if (!options.isRequirePaymentCollection) {
      return null;
    }

    const editable =
      status === 'ACTIVE' &&
      focusedJob.isAllowDriverEditOnApp;

    return (
      <View
        ref={ref => paymentCollectionRefs.current[index] = ref}
      >
        <SpaceView mTop={SIZE2} />
        <RowWrap>
          <LabelText>Collections</LabelText>
          {
            status !== 'COMPLETED' &&
            <RowWrap>
              <SpaceView mLeft={SIZE1} />
              {
                amountCollected
                ? <BlackActiveCircleCheckIcon />
                : <DeactiveCircleCheckIcon />
              }
            </RowWrap>
          }
        </RowWrap>
        {
          isCompletedJobState
          ? !!amountCollected &&
            <View>
              <SpaceView mTop={SIZE1} />
              <InfoText>
                {
                  `$${amountCollected} ` +
                  focusedJob.jobPaymentTypeList[jobPaymentType]
                }
              </InfoText>
            </View>
          : !!focusedJob.steps[index].amountToCollect &&
            <View>
              <SpaceView mTop={SIZE1} />
              <InfoText>
                {
                  `$${focusedJob.steps[index].amountToCollect} ` +
                  focusedJob.jobPaymentTypeList[
                    focusedJob.steps[index].jobPaymentType
                  ]
                }
              </InfoText>
            </View>
        }
        {
          !isCompletedJobState &&
          <View>
            <SpaceView mTop={SIZE2} />
            <RowWrap>
              <FlexWrap flex={3}>
                <BinInputWrap
                  color={
                    editable
                    ? COLORS.BLUE1 : COLORS.TRANSPARENT1
                  }
                  effect={!isCompletedJobState}
                >
                  <RowWrap>
                    <InfoText>$</InfoText>
                    <SpaceView mLeft={SIZE2} />
                    <BinInput
                      underlineColorAndroid={COLORS.TRANSPARENT1}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      value={`${amountCollected || ''}`}
                      onChangeText={(text) =>
                        setAmountCollected(text)
                      }
                      editable={editable}
                      keyboardType={'numeric'}
                    />
                  </RowWrap>
                </BinInputWrap>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
              <FlexWrap flex={2}>
                <BinInputWrap
                  color={
                    editable
                    ? COLORS.BLUE1 : COLORS.TRANSPARENT1
                  }
                  effect={!isCompletedJobState}
                >
                  <FlexWrap>
                    <TouchableOpacity
                      onPress={onShowActionSheetForPaymentType}
                      disabled={!editable}
                    >
                      <RowWrap>
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
                      </RowWrap>
                    </TouchableOpacity>
                  </FlexWrap>
                </BinInputWrap>
              </FlexWrap>
            </RowWrap>
          </View>
        }
        <SpaceView mTop={SIZE2} />
      </View>
    );
  };

  const renderPrintReceipt = ({
    index,
  }) => {
    if (
      stepIndexForOthers.current !== index ||
      !(
        isCompletedJobState ||
        jobStatus === JOB_STATUS.IN_PROGRESS
      )
    ) {
      return null;
    }

    return (
      <View>
        <SpaceView
          mTop={SIZE3} mBottom={SIZE3}
        />
        <CenteredWrap>
          <PrintReceiptButton
            color={
              isCompletedJobState
              ? COLORS.BLUE1 : COLORS.BLACK2
            }
            onPress={() => onPrint(
              getBinInOutInfoIndex,
              getCustomerSiteIndex,
            )}
          >
            {
              isCompletedJobState
              ? <ActivePrintIcon />
              : <DeactivePrintIcon />
            }
            <SpaceView mLeft={SIZE1} />
            <InfoText
              color={
                isCompletedJobState
                ? COLORS.BLUE1 : COLORS.BLACK2
              }
            >
              PRINT RECEIPT
            </InfoText>
          </PrintReceiptButton>
        </CenteredWrap>
        <SpaceView mTop={SIZE3} />
      </View>
    );
  };

  const renderBinInfo = () => {
    return (
      binInfo.map((item, index) => {
        let isSpecial = false;

        if (!item.binType && !item.wasteType) {
          if (focusedJob.jobTypeName === JOB_TYPE.SHIFT) {
            isSpecial = true;
          } else {
            return null;
          }
        }

        const idx = getBinInOutInfoIndex(index);
        const options = getBinInfoOptions(index);
        const status = getBinInfoStatus(index);

        if (
          idx !== 0 && idx !== 1 &&
          index === stepIndexForBinWeight.current
        ) {
          return null;
        }

        return (
          <View
            ref={ref => binInfoRefs.current[index] = ref}
            key={`${item.jobStepId}`}
          >
            <SpaceView mTop={SIZE2} />
            <ContentWrap>
              <RowWrap>
                <RowWrap>
                  {
                    idx === 0
                    ? <BinInIcon />
                    : idx === 1
                      ? <BinOutIcon />
                      : <BinIcon />
                  }
                  <SpaceView mLeft={SIZE1} />
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
              {
                renderBinNumber({
                  item,
                  index,
                  options,
                  status,

                  isSpecial,
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
                  index,
                  options,
                  status,
                })
              }
              {
                renderAdditionalServices({
                  index,
                  status,
                })
              }
              {
                renderCollections({
                  index,
                  options,
                  status,
                })
              }
              {
                renderPrintReceipt({
                  index,
                })
              }
            </ContentWrap>
          </View>
        );
      })
    );
  };

  const renderBinWeight = () => {
    if (stepIndexForBinWeight.current === -1) {
      return null;
    }

    const stepIndex = stepIndexForBinWeight.current;
    const binIndex = stepIndex - 1;

    const idx = getBinInOutInfoIndex(stepIndex);
    const options = getBinInfoOptions(stepIndex);
    const status = getBinInfoStatus(stepIndex);

    if (!options.isRequireBinWeight) {
      return null;
    }

    const editable =
      status === 'ACTIVE' &&
      focusedJob.isAllowDriverEditOnApp;

    return (
      <View
        ref={ref => binInfoRefs.current[stepIndex] = ref}
      >
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <RowWrap>
              <BinWeightIcon />
              <SpaceView mLeft={SIZE1} />
              <TitleText>Bin Weight</TitleText>
            </RowWrap>
            {
              status !== 'COMPLETED' &&
              options.isRequireBinWeight &&
              <RowWrap>
                <SpaceView mLeft={SIZE1} />
                {
                  binInfo[binIndex]['binWeight']
                  ? <BlackActiveCircleCheckIcon />
                  : <DeactiveCircleCheckIcon />
                }
              </RowWrap>
            }
          </RowWrap>
          <SpaceView mTop={SIZE2} />
          {
            isCompletedJobState
            ? <RowWrap>
                <FlexWrap>
                  <LabelText>Nett weight</LabelText>
                  <SpaceView mTop={SIZE1} />
                  <InfoText>
                    {
                      binInfo[binIndex]['binWeight']
                      ? binInfo[binIndex]['binWeight'] + ' tons'
                      : ' --- '
                    }
                  </InfoText>
                </FlexWrap>
                {
                  jobDateList.current &&
                  jobDateList.current[stepIndex].length !== 0 &&
                  jobDateList.current[stepIndex].map((el) => (
                    !!focusedJob[el.field] &&
                    <FlexWrap key={el.label}>
                      <LabelText>{el.label}</LabelText>
                      <SpaceView mTop={SIZE1} />
                      <InfoText>
                        {moment(focusedJob[el.field]).format('hh:mm A')}
                      </InfoText>
                    </FlexWrap>
                  ))
                }
              </RowWrap>
            : <RowWrap>
                <FlexWrap>
                  <BinInputWrap
                    color={
                      editable
                      ? COLORS.BLUE1 : COLORS.TRANSPARENT1
                    }
                    effect={!isCompletedJobState}
                  >
                    <BinInput
                      underlineColorAndroid={COLORS.TRANSPARENT1}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      value={`${binInfo[binIndex]['binWeight'] || ''}`}
                      onChangeText={(text) =>
                        onUpdateBinInfo(binIndex, { binWeight: text })
                      }
                      editable={editable}
                      keyboardType={'numeric'}
                    />
                  </BinInputWrap>
                </FlexWrap>
                <SpaceView mLeft={SIZE2} />
                <FlexWrap>
                  <InfoText>tons</InfoText>
                </FlexWrap>
              </RowWrap>
          }
          <SpaceView mTop={SIZE2} />
          {
            renderWasteType({
              item: binInfo[binIndex],
              index: binIndex,
              idx,
              options,
              status,

              stepIndex,
            })
          }
          {
            renderPhotosAndSign({
              item: focusedJob.steps[stepIndex],
              index: stepIndex,
              options,
              status,
            })
          }
        </ContentWrap>
      </View>
    );
  };

  const renderDriverMessage = () => {
    return (
      <ContentWrap mTop={SIZE1}>
        <RowWrap>
          <LabelText>Driver Message</LabelText>
          {
            focusedJob.haveUnreadMessage &&
            <DriverMessageBadge />
          }
        </RowWrap>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity
          onPress={onDriverMessage}
          disabled={jobStatus === JOB_STATUS.COMPLETED}
        >
          <RowWrap>
            <FlexWrap>
              <InfoText numberOfLines={2}>
                {
                  focusedJob.messages.length > 0
                  ? focusedJob.messages[0].message
                  : ' --- '
                }
              </InfoText>
            </FlexWrap>
            {
              jobStatus !== JOB_STATUS.COMPLETED &&
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <BlackRightArrowIcon />
                <SpaceView mLeft={SIZE2} />
              </RowWrap>
            }
          </RowWrap>
        </TouchableOpacity>
      </ContentWrap>
    );
  };

  const renderLocationAndTime = () => {
    const { steps } = focusedJob;

    const index = getCustomerSiteIndex();

    return (
      <ContentWrap mTop={SIZE4}>
        <LabelText>Location & Time</LabelText>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity
          onPress={() => onAddress(index)}
          disabled={jobStatus === JOB_STATUS.COMPLETED}
        >
          <RowWrap>
            <FlexWrap>
              <InfoText numberOfLines={1}>
                {focusedJob.customer.customerName}
              </InfoText>
              <SpaceView mTop={SIZE1} />
              <InfoText numberOfLines={1}>
                {
                  steps[index].site
                  ? getCustomerSiteAddress(steps[index].site)
                  : steps[index].address
                }
              </InfoText>
              <SpaceView mTop={SIZE1} />
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
            {
              jobStatus !== JOB_STATUS.COMPLETED &&
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <BlackRightArrowIcon />
                <SpaceView mLeft={SIZE2} />
              </RowWrap>
            }
          </RowWrap>
        </TouchableOpacity>
      </ContentWrap>
    );
  };

  const renderFooter = () => {
    const forToday = getDate() ===
      getDate(focusedJob.jobTimeSpecific || focusedJob.jobDate);

    let buttonColor, buttonText, buttonAction;

    if (JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)) {
      buttonColor = COLORS.BLUE1;
      buttonText = 'Acknowledge';
      buttonAction = onAcknowledge;
    } else if (jobStatus === JOB_STATUS.ACKNOWLEDGED) {
      buttonColor = forToday ? COLORS.BLUE1 : COLORS.GRAY3;
      buttonText = 'Start Job';
      buttonAction = forToday ? () => onValidate(onStart) : null;
    } else if (jobStatus === JOB_STATUS.STARTED) {
      if (focusedJob.jobTypeName === JOB_TYPE.PULL) {
        buttonColor = COLORS.PURPLE1;
        buttonText = 'In Progress';
        buttonAction = () => onValidate(onPull);
      } else if (focusedJob.jobTypeName === JOB_TYPE.SHIFT) {
        buttonColor = COLORS.PURPLE1;
        buttonText = 'In Progress';
        buttonAction = () => onValidate(onShift);
      } else if (focusedJob.steps.length === 3) {
        buttonColor = COLORS.PURPLE1;
        buttonText = 'In Progress';
        buttonAction = () => onValidate(onExchange);
      } else {
        buttonColor = COLORS.GREEN1;
        buttonText = 'Complete Job';
        buttonAction = () => onValidate(onComplete);
      }
    } else if (jobStatus === JOB_STATUS.IN_PROGRESS) {
      buttonColor = COLORS.GREEN1;
      buttonText = 'Complete Job';
      buttonAction = () => onValidate(onComplete);
    }

    if (
      buttonAction &&
      validationCurrentStep.easy
    ) {
      buttonColor = buttonColor + '4C'; // opacity: 30%
      buttonAction = () => onScroll(validationCurrentStep.ref);
    }

    return (
      !!buttonText &&
      <ContentWrap
        mLeft={SIZE3} mRight={SIZE3}
      >
        <DefaultButton
          color={buttonColor}
          text={buttonText}
          onPress={buttonAction}
          loading={loading}
          mTop={-SIZE1} mBottom={-SIZE1}
        />
      </ContentWrap>
    );
  };

  const renderHeader = () => {
    return (
      <HeaderBar
        centerIcon={
          <ScreenText>
            {
              (
                isCompletedJobState
                ? `Job ${jobStatus}`
                : focusedJob.jobTemplateName || focusedJob.jobTypeName
              ).toUpperCase()
            }
          </ScreenText>
        }
        leftIcon={<Back />}
        rightIcon={
          isInProgress &&
          focusedJob.isEnableFailJob
          ? <Help /> : <EmptyWrap />
        }
        onPressLeft={onBack}
        onPressRight={
          isInProgress &&
          focusedJob.isEnableFailJob
          ? onFail : null
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
          showsVerticalScrollIndicator={false}
        >
          { renderLocationAndTime() }
          { renderDriverMessage() }
          { renderBinInfo() }
          { renderBinWeight() }
          <SpaceView mTop={SIZE2} />
        </ScrollView>
      </Content>

      <ShadowWrap forUp>
        { renderFooter() }
      </ShadowWrap>

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
  onShift: PropTypes.func.isRequired,
  onExchange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onCancelPhoto: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onAddress: PropTypes.func.isRequired,
  onDriverMessage: PropTypes.func.isRequired,
  onAddServices: PropTypes.func.isRequired,
  onAddWasteTypes: PropTypes.func.isRequired,
  onScanCode: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  amountCollected: '',
};

export default JobDetailsScreenView;
