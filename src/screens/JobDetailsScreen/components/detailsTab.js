import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import { showLocation } from 'react-native-map-link';

import {
  SVGS,
  COLORS,
  JOB_STATUS,
  JOB_TYPE,
  SIZE1,
  SIZE2,
} from 'src/constants';
import {
  DefaultButton,
  ItemWrap,
} from 'src/components';
import {
  openUrl,
} from 'src/utils';

import {
  ShadowWrap,
  FullImage,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';

import {
  JobDetails,
  Content,
  LabelText,
  InfoText,
  LocationInfo,
  LocationRow,
  IconWrap,
  Border,
  ContactInfo,
  InfoWrap,
  NumberText,
  RowWrap,
  CashButton,
  BinInfoWrap,
  BinInfoRow,
  BinText,
  BinInput,
  PhotoAndSignWrap,
  PhotoAndSignText,
  AttachmentWrap,
  HalfWrap,
  SignInfo,
  SignInfoText,
  CancelButton,
} from '../styled';

const {
  Location1Icon,
  Location2Icon,
  Location3Icon,
  CameraIcon,
  SignIcon,
  EditIcon,
  ActiveCashIcon,
  DeactiveCashIcon,
  ArrowLocationIcon,
  CancelIcon,
} = SVGS;

const DetailsTab = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  setBinInfo,
  jobStatus,
  setTabIndex,

  focusedJob,

  onAcknowledge,
  onPhoto,
  onSign,
  onCancelPhoto,
  onCancelSign,
  isInProgress,
}) => {
  const [ binIndex, setBinIndex ] = useState(0);

  const [ chargeIndex, setChargeIndex ] = useState(-1);

  const [ actionSheetData, setActionSheetData ] = useState([]);

  const actionSheetRef = useRef(null);
  const actionSheetKey = useRef(null);

  const inputBinWeight = useRef(null);

  const onLocation = (latitude, longitude) => {
    showLocation({ latitude, longitude });
  };

  const onContact = (phoneNumber) => {
    openUrl(`tel:${phoneNumber}`);
  };

  const onActionSheetPress = (index) => {
    const { charges } = focusedJob;

    if (index === actionSheetData.length) {
      return;
    }

    if (
      actionSheetKey.current === 'wasteType' ||
      actionSheetKey.current === 'binType'
    ) {
      onUpdateBinInfo({
        wasteType: charges[index].wasteType,
        binType: charges[index].binType,
      });

      setChargeIndex(index);
    } else {
      onUpdateBinInfo({
        binNumber: charges[chargeIndex].binType.binNumbers[index].binNumberName,
      });
    }
  };

  const getInitChargeIndex = () => {
    try {
      const { charges } = focusedJob;
      const { binTypeId } = binInfo[binIndex].binType;

      const index = charges
        .findIndex(charge => charge.binType.binTypeId === binTypeId);

      if (index !== -1) {
        setChargeIndex(index);
      }

      return index;
    } catch (error) {
      return -1;
    }
  };

  const onShowActionSheet = (key) => {
    const { charges } = focusedJob;

    if (charges.length === 0) {
      Alert.alert('Warning', 'The customer has no Bin / Waste.');
      return;
    }

    actionSheetKey.current = key;

    let data = [];
    if (key === 'wasteType' || key === 'binType') {
      data = charges
        .map(charge => charge[key][`${key}Name`]);
    } else {
      const index = chargeIndex !== -1
        ? chargeIndex
        : getInitChargeIndex();

      if (index === -1) {
        Alert.alert('Warning', 'You can take Bin Numbers after a Bin Type is selected.');
        return;
      }

      data = charges[index].binType.binNumbers
        .map(binNumber => binNumber[`${key}Name`]);

      if (data.length === 0) {
        Alert.alert('Warning', 'There are no Bin Numbers.');
        return;
      }
    }
    setActionSheetData(data);

    actionSheetRef.current.show();
  };

  const onUpdateBinInfo = (newInfo) => {
    const newBinInfo = binInfo.slice(0);

    newBinInfo[binIndex] = {
      ...newBinInfo[binIndex],
      ...newInfo,
    };

    setBinInfo(newBinInfo);
  };

  const isForComplete = () => {
    return (
      (jobStatus === JOB_STATUS.IN_PROGRESS2 ||
      (jobStatus === JOB_STATUS.IN_PROGRESS1 && focusedJob.steps.length === 2))
    );
  };

  const getBinInOut = (index) => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS2
        ) {
          return '';
        }

        if (
          jobStatus === JOB_STATUS.DISPATCHED ||
          jobStatus === JOB_STATUS.ACKNOWLEDGED ||
          jobStatus === JOB_STATUS.IN_PROGRESS1
        ) {
          return ' (IN)';
        } else {
          return ' (OUT)';
        }

      case JOB_TYPE.PUT:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS2
        ) {
          return '';
        }

        if (jobStatus === JOB_STATUS.COMPLETED) {
          return ' (IN)';
        } else {
          return ' (OUT)';
        }

      case JOB_TYPE.EXCHANGE:
        if (jobStatus === JOB_STATUS.COMPLETED) {
          return index === 0 ? ' (IN)' : ' (OUT)';
        } else {
          return index === 0 ? ' (OUT)' : ' (IN)';
        }

      case JOB_TYPE.OUT:
        if (index !== 0) {
          return '';
        }

        if (jobStatus === JOB_STATUS.COMPLETED) {
          return ' (IN)';
        } else {
          return ' (OUT)';
        }

      case JOB_TYPE.SHIFT:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS2
        ) {
          return '';
        }

        if (jobStatus === JOB_STATUS.IN_PROGRESS1) {
          return ' (IN)';
        } else {
          return ' (OUT)';
        }

      default:
        return '';
    };
  };

  const renderLocationInfo = () => {
    const { steps } = focusedJob;

    return (
      <View>
        <LabelText>Locations</LabelText>
        <LocationInfo>
          <LocationRow>
            <IconWrap>
              <Location1Icon />
            </IconWrap>
            <InfoText>
              {steps[0].address}
            </InfoText>
            <SpaceView mLeft={SIZE2} />
            {
              !!steps[0].customerSiteId &&
              <TouchableOpacity
                onPress={() => onLocation(steps[0].latitude, steps[0].longitude)}
              >
                <ArrowLocationIcon />
              </TouchableOpacity>
            }
          </LocationRow>

          <View>
            <Border />
            <LocationRow>
              <IconWrap>
                <Location2Icon />
              </IconWrap>
              <InfoText>
                {steps[1].address}
              </InfoText>
              <SpaceView mLeft={SIZE2} />
              {
                !!steps[1].customerSiteId &&
                <TouchableOpacity
                  onPress={() => onLocation(steps[1].latitude, steps[1].longitude)}
                >
                  <ArrowLocationIcon />
                </TouchableOpacity>
              }
            </LocationRow>
          </View>

          {
            steps.length === 3 &&
            <View>
              <Border />
              <LocationRow>
                <IconWrap>
                  <Location3Icon />
                </IconWrap>
                <InfoText>
                  {steps[2].address}
                </InfoText>
                <SpaceView mLeft={SIZE2} />
                {
                  !!steps[2].customerSiteId &&
                  <TouchableOpacity
                    onPress={() => onLocation(steps[2].latitude, steps[2].longitude)}
                  >
                    <ArrowLocationIcon />
                  </TouchableOpacity>
                }
              </LocationRow>
            </View>
          }
        </LocationInfo>
      </View>
    );
  };

  const renderContactInfo = () => {
    const { steps } = focusedJob;

    let stepIndex = steps.length - 1;
    if (
      jobStatus === JOB_STATUS.ACKNOWLEDGED ||
      jobStatus === JOB_STATUS.IN_PROGRESS1 ||
      jobStatus === JOB_STATUS.CANCELLED ||
      JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
    ) {
      if (steps[0].contactPersonOne && steps[0].contactNumberOne) {
        stepIndex = 0;
      } else {
        stepIndex = 1;
      }
    } else if (jobStatus === JOB_STATUS.IN_PROGRESS2) {
      if (steps[2].contactPersonOne && steps[2].contactNumberOne) {
        stepIndex = 2;
      } else {
        stepIndex = 1;
      }
    } else {
      if (steps[stepIndex].contactPersonOne && steps[stepIndex].contactNumberOne) {
        stepIndex = stepIndex;
      } else {
        stepIndex = stepIndex - 1;
      }
    }

    return (
      <ContactInfo>
        <InfoWrap>
          <LabelText>Delivery Order</LabelText>
          <InfoText>{focusedJob.jobNumber}</InfoText>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Customer</LabelText>
          <InfoText>{focusedJob.customer.customerName}</InfoText>
        </InfoWrap>
        <RowWrap>
          <InfoWrap>
            <LabelText>Customer Contact & Phone Number</LabelText>
            <RowWrap>
              <InfoText>
                {
                  steps[stepIndex].contactPersonOne ||
                  focusedJob.customer.contactPerson
                }
              </InfoText>
              <InfoText>
                {'  |  '}
              </InfoText>
              <TouchableOpacity
                onPress={() => onContact(
                  steps[stepIndex].contactNumberOne ||
                  focusedJob.customer.contactNumber
                )}
              >
                <NumberText>
                  {
                    steps[stepIndex].contactNumberOne ||
                    focusedJob.customer.contactNumber
                  }
                </NumberText>
              </TouchableOpacity>
            </RowWrap>

            {
              !!steps[stepIndex].contactPersonTwo &&
              !!steps[stepIndex].contactNumberTwo &&
              <View>
                <SpaceView mTop={SIZE1} />
                <RowWrap>
                  <InfoText>
                    {steps[stepIndex].contactPersonTwo}
                  </InfoText>
                  <InfoText>
                    {'  |  '}
                  </InfoText>
                  <TouchableOpacity
                    onPress={() => onContact(
                      steps[stepIndex].contactNumberTwo
                    )}
                  >
                    <NumberText>
                      {steps[stepIndex].contactNumberTwo}
                    </NumberText>
                  </TouchableOpacity>
                </RowWrap>
              </View>
            }
          </InfoWrap>
          {
            !!focusedJob.amountToCollect &&
            <CashButton
              onPress={() => setTabIndex(1)}
              disabled={focusedJob.collectedAmount}
            >
              {
                focusedJob.collectedAmount
                ? <DeactiveCashIcon /> : <ActiveCashIcon />
              }
            </CashButton>
          }
        </RowWrap>
        <InfoWrap>
          <LabelText>Date & Time</LabelText>
          <InfoText>
            {
              `${moment(focusedJob.jobTimeSpecific || focusedJob.jobDate).format('DD MMM')}` +
              (
                focusedJob.jobTimeSpecific
                ? ` | ${moment(focusedJob.jobTimeSpecific).format('hh:mm A')}` : ''
              )
            }
          </InfoText>
        </InfoWrap>
      </ContactInfo>
    );
  };

  const renderBinInfo = () => {
    const editable = isInProgress() && focusedJob.isAllowDriverEditOnApp;

    return (
      <View>
        {
          binInfo.map((item, index) => (
            (item.wasteType || item.binType) &&
            <BinInfoWrap key={`${item.jobStepId}`}>
              <InfoText numberOfLines={1}>
                {
                  `BIN ${index + 1}` + getBinInOut(index)
                }
              </InfoText>
              <RowWrap>
                <FlexWrap flex={0.5}>
                  <LabelText>Waste Type</LabelText>
                </FlexWrap>
                <BinInfoRow editable={editable}>
                  <BinText
                    numberOfLines={2}
                    editable={editable}
                  >
                    {item['wasteType'] && item['wasteType']['wasteTypeName']}
                  </BinText>
                  {
                    editable &&
                    <TouchableOpacity
                      onPress={() => onShowActionSheet('wasteType')}
                    >
                      <EditIcon />
                    </TouchableOpacity>
                  }
                </BinInfoRow>
              </RowWrap>

              <RowWrap>
                <FlexWrap flex={0.5}>
                  <LabelText>Bin Type</LabelText>
                </FlexWrap>
                <BinInfoRow editable={editable}>
                  <BinText
                    numberOfLines={2}
                    editable={editable}
                  >
                    {item['binType'] && item['binType']['binTypeName']}
                  </BinText>
                  {
                    editable &&
                    <TouchableOpacity
                      onPress={() => onShowActionSheet('binType')}
                    >
                      <EditIcon />
                    </TouchableOpacity>
                  }
                </BinInfoRow>
              </RowWrap>

              <RowWrap>
                <FlexWrap flex={0.5}>
                  <LabelText
                    required={focusedJob.isRequireBinNumberToStart}
                  >
                    {
                      focusedJob.isRequireBinNumberToStart
                      ? 'Bin ID *' : 'Bin ID'
                    }
                  </LabelText>
                </FlexWrap>
                <BinInfoRow editable={editable}>
                  <BinInput
                    underlineColorAndroid={COLORS.TRANSPARENT1}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder={'BIN NUMBER'}
                    value={`${item['binNumber'] || ''}`}
                    onChangeText={(text) => {
                      setBinIndex(index);
                      onUpdateBinInfo({ binNumber: text });
                    }}
                    editable={editable}
                  />
                  {
                    editable &&
                    <TouchableOpacity
                      onPress={() => onShowActionSheet('binNumber')}
                    >
                      <EditIcon />
                    </TouchableOpacity>
                  }
                </BinInfoRow>
              </RowWrap>

              {
                focusedJob.isEnabledBinWeight &&
                (!!item['binWeight'] || editable) &&
                <RowWrap>
                  <FlexWrap flex={0.5}>
                    <LabelText>Bin Weight</LabelText>
                  </FlexWrap>
                  <BinInfoRow editable={editable}>
                    <BinInput
                      ref={inputBinWeight}
                      underlineColorAndroid={COLORS.TRANSPARENT1}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      placeholder={'BIN WEIGHT'}
                      keyboardType={'numeric'}
                      value={`${item['binWeight'] || ''}`}
                      onChangeText={(text) => {
                        setBinIndex(index);
                        onUpdateBinInfo({ binWeight: text });
                      }}
                      editable={editable}
                    />
                    {
                      editable &&
                      <TouchableOpacity
                        onPress={() => inputBinWeight.current.focus()}
                      >
                        <EditIcon />
                      </TouchableOpacity>
                    }
                  </BinInfoRow>
                </RowWrap>
              }
            </BinInfoWrap>
          ))
        }

        <ActionSheet
          ref={actionSheetRef}
          title={'Please select one.'}
          options={[ ...actionSheetData, 'Cancel' ]}
          cancelButtonIndex={actionSheetData.length}
          onPress={onActionSheetPress}
        />
      </View>
    );
  };

  const renderAttachments = () => {
    return (
      <View>
        {
          photos.map((photo, index) =>
            <ItemWrap key={photo.uri} mLeft={0} mRight={0}>
              <AttachmentWrap>
                <FullImage source={{ uri: photo.uri }} />
                {
                  isForComplete() &&
                  <CancelButton
                    onPress={() => onCancelPhoto(index)}
                  >
                    <CancelIcon />
                  </CancelButton>
                }
              </AttachmentWrap>
            </ItemWrap>
          )
        }
        {
          !!sign.uri &&
          <ItemWrap mLeft={0} mRight={0}>
            <AttachmentWrap>
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
              {
                isForComplete() &&
                <CancelButton onPress={onCancelSign}>
                  <CancelIcon />
                </CancelButton>
              }
            </AttachmentWrap>
          </ItemWrap>
        }
      </View>
    );
  };

  const renderPhotoAndSign = () => {
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

  return (
    <FlexWrap>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <JobDetails>
          <ShadowWrap>
            <Content>
              { renderLocationInfo() }
              { renderContactInfo() }
              { renderBinInfo() }
              { renderAttachments() }

              {
                JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus) &&
                <DefaultButton
                  text={'Acknowledge'}
                  color={COLORS.BLUE1}
                  onPress={onAcknowledge}
                  loading={loading}
                />
              }
            </Content>
          </ShadowWrap>
        </JobDetails>
      </ScrollView>
      {
        isForComplete() &&
        renderPhotoAndSign()
      }
    </FlexWrap>
  );
};

DetailsTab.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  jobStatus: PropTypes.string.isRequired,
  setTabIndex: PropTypes.func.isRequired,

  focusedJob: PropTypes.object.isRequired,

  onAcknowledge: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onCancelPhoto: PropTypes.func.isRequired,
  onCancelSign: PropTypes.func.isRequired,
  isInProgress: PropTypes.func.isRequired,
};

DetailsTab.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default DetailsTab;
