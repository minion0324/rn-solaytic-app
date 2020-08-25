import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';

import {
  SVGS,
  COLORS,
  JOB_DATE,
  JOB_STATUS,
  SIZE1,
  SIZE2,
} from 'src/constants';
import {
  DefaultButton,
  ItemWrap,
} from 'src/components';

import {
  ShadowWrap,
  FullImage,
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
  BinButtonWrap,
  BinButton,
  BinButtonText,
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
} from '../styled';

const {
  Location1Icon,
  Location2Icon,
  Location3Icon,
  CameraIcon,
  SignIcon,
  EditIcon,
  CashIcon,
  ArrowLocationIcon,
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
  isInProgress,
}) => {
  const [ binIndex, setBinIndex ] = useState(0);

  const [ chargeIndex, setChargeIndex ] = useState(-1);

  const [ actionSheetData, setActionSheetData ] = useState([]);

  const actionSheetRef = useRef(null);
  const actionSheetKey = useRef(null);

  const inputBinWeight = useRef(null);

  const onContact = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
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

  const renderLocationInfo = () => {
    const locations = focusedJob.steps.map(item => item.address);

    return (
      <View>
        <LabelText>Locations</LabelText>
        <LocationInfo>
          <LocationRow>
            <IconWrap>
              <Location1Icon />
            </IconWrap>
            <InfoText numberOfLines={1}>
              {locations[0]}
            </InfoText>
          </LocationRow>

          {
            locations.length === 3 &&
            <View>
              <Border />
              <LocationRow>
                <IconWrap>
                  <Location2Icon />
                </IconWrap>
                <InfoText numberOfLines={1}>
                  {locations[1]}
                </InfoText>
                <SpaceView mLeft={SIZE2} />
                <TouchableOpacity>
                  <ArrowLocationIcon />
                </TouchableOpacity>
              </LocationRow>
            </View>
          }

          {
            <View>
              <Border />
              <LocationRow>
                <IconWrap>
                  <Location3Icon />
                </IconWrap>
                <InfoText numberOfLines={1}>
                  {locations.length === 3 ? locations[2] : locations[1]}
                </InfoText>
              </LocationRow>
            </View>
          }
        </LocationInfo>
      </View>
    );
  };

  const renderContactInfo = () => {
    const jobDate = moment(focusedJob[JOB_DATE[0]] || focusedJob[JOB_DATE[1]]);

    let stepIndex = focusedJob.steps.length - 1;
    if (
      jobStatus === JOB_STATUS.ACKNOWLEDGED ||
      jobStatus === JOB_STATUS.IN_PROGRESS1 ||
      jobStatus === JOB_STATUS.CANCELLED ||
      JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
    ) {
      if (
        focusedJob.steps[0].contactPersonOne &&
        focusedJob.steps[0].contactNumberOne
      ) {
        stepIndex = 0;
      } else {
        stepIndex = 1;
      }
    } else if (jobStatus === JOB_STATUS.IN_PROGRESS2) {
      if (
        focusedJob.steps[2].contactPersonOne &&
        focusedJob.steps[2].contactNumberOne
      ) {
        stepIndex = 2;
      } else {
        stepIndex = 1;
      }
    } else {
      if (
        focusedJob.steps[stepIndex].contactPersonOne &&
        focusedJob.steps[stepIndex].contactNumberOne
      ) {
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
                  focusedJob.steps[stepIndex].contactPersonOne
                  || focusedJob.customer.contactPerson
                }
              </InfoText>
              <InfoText>
                {'  |  '}
              </InfoText>
              <TouchableOpacity
                onPress={() => onContact(
                  focusedJob.steps[stepIndex].contactNumberOne
                  || focusedJob.customer.contactNumber
                )}
              >
                <NumberText>
                  {
                    focusedJob.steps[stepIndex].contactNumberOne
                    || focusedJob.customer.contactNumber
                  }
                </NumberText>
              </TouchableOpacity>
            </RowWrap>

            {
              !!focusedJob.steps[stepIndex].contactPersonTwo &&
              !!focusedJob.steps[stepIndex].contactNumberTwo &&
              <View>
                <SpaceView mTop={SIZE1} />
                <RowWrap>
                  <InfoText>
                    {focusedJob.steps[stepIndex].contactPersonTwo}
                  </InfoText>
                  <InfoText>
                    {'  |  '}
                  </InfoText>
                  <TouchableOpacity
                    onPress={() => onContact(
                      focusedJob.steps[stepIndex].contactNumberTwo
                    )}
                  >
                    <NumberText>
                      {focusedJob.steps[stepIndex].contactNumberTwo}
                    </NumberText>
                  </TouchableOpacity>
                </RowWrap>
              </View>
            }
          </InfoWrap>
          {
            !focusedJob.collectedAmount &&
            <CashButton onPress={() => setTabIndex(1)}>
              <CashIcon />
            </CashButton>
          }
        </RowWrap>
        <InfoWrap>
          <LabelText>Date & Time</LabelText>
          <InfoText>
            {`${jobDate.format('DD MMM')} | ${jobDate.format('hh:mm A')}`}
          </InfoText>
        </InfoWrap>
      </ContactInfo>
    );
  };

  const renderBinInfo = () => {
    return (
      <View>
        {
          binInfo[1].wasteType || binInfo[1].binType
          ? <BinButtonWrap>
              <BinButton
                active={binIndex === 0}
                onPress={() => setBinIndex(0)}
              >
                <BinButtonText active={binIndex === 0}>Bin1</BinButtonText>
              </BinButton>
              <BinButton
                active={binIndex === 1}
                onPress={() => setBinIndex(1)}
              >
                <BinButtonText active={binIndex === 1}>Bin2</BinButtonText>
              </BinButton>
            </BinButtonWrap>
          : <BinButtonWrap>
              <BinButton
                active={binIndex === 0}
                onPress={() => setBinIndex(0)}
              >
                <BinButtonText active={binIndex === 0}>Bin</BinButtonText>
              </BinButton>
            </BinButtonWrap>
        }
        <BinInfoWrap>
          {
            ['wasteType', 'binType'].map((key) => (
              <BinInfoRow key={key}>
                <BinText
                  numberOfLines={2}
                  editable={
                    isInProgress() &&
                    focusedJob.isAllowDriverEditOnApp
                  }
                >
                  {
                    binInfo[binIndex][key] &&
                    binInfo[binIndex][key][`${key}Name`]
                  }
                </BinText>
                {
                  isInProgress() &&
                  focusedJob.isAllowDriverEditOnApp &&
                  <TouchableOpacity
                    onPress={() => onShowActionSheet(key)}
                  >
                    <EditIcon />
                  </TouchableOpacity>
                }
              </BinInfoRow>
            ))
          }

          <BinInfoRow>
            <BinInput
              underlineColorAndroid={COLORS.TRANSPARENT1}
              autoCapitalize={'none'}
              autoCorrect={false}
              value={
                `${binInfo[binIndex]['binNumber'] || ''}`
              }
              onChangeText={(text) => onUpdateBinInfo({ binNumber: text })}
              editable={
                isInProgress() &&
                focusedJob.isAllowDriverEditOnApp
              }
            />
            {
              isInProgress() &&
              focusedJob.isAllowDriverEditOnApp &&
              <TouchableOpacity
                onPress={() => onShowActionSheet('binNumber')}
              >
                <EditIcon />
              </TouchableOpacity>
            }
          </BinInfoRow>

          {
            (!!binInfo[binIndex]['binWeight'] ||
            (isInProgress() &&
            focusedJob.isAllowDriverEditOnApp)) &&
            focusedJob.isEnabledBinWeight &&
            <BinInfoRow>
              <BinInput
                ref={inputBinWeight}
                underlineColorAndroid={COLORS.TRANSPARENT1}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholder={'BIN WEIGHT'}
                keyboardType={'numeric'}
                value={
                  `${binInfo[binIndex]['binWeight'] || ''}`
                }
                onChangeText={(text) => onUpdateBinInfo({ binWeight: text })}
                editable={
                  isInProgress() &&
                  focusedJob.isAllowDriverEditOnApp
                }
              />
              {
                isInProgress() &&
                focusedJob.isAllowDriverEditOnApp &&
                <TouchableOpacity
                  onPress={() => inputBinWeight.current.focus()}
                >
                  <EditIcon />
                </TouchableOpacity>
              }
            </BinInfoRow>
          }
        </BinInfoWrap>

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
          photos.map(imageUri =>
            <ItemWrap key={imageUri} mLeft={0} mRight={0}>
              <AttachmentWrap>
                <FullImage source={{ uri: imageUri }} />
              </AttachmentWrap>
            </ItemWrap>
          )
        }
        {
          !!sign &&
          <ItemWrap mLeft={0} mRight={0}>
            <AttachmentWrap>
              <HalfWrap>
                <FullImage source={{ uri: sign }} />
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
            </AttachmentWrap>
          </ItemWrap>
        }
      </View>
    );
  };

  const renderPhotoAndSign = () => {
    return (
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
    );
  };

  return (
    <JobDetails>
      <ShadowWrap>
        <Content>
          { renderLocationInfo() }
          { renderContactInfo() }
          { renderBinInfo() }
          { renderAttachments() }
          {
            (jobStatus === JOB_STATUS.IN_PROGRESS2 ||
            (jobStatus === JOB_STATUS.IN_PROGRESS1 && focusedJob.steps.length === 2)) &&
            renderPhotoAndSign()
          }
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
  );
};

DetailsTab.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.string,
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
  isInProgress: PropTypes.func.isRequired,
};

DetailsTab.defaultProps = {
  sign: '',
  signedUserName: '',
  signedUserContact: '',
};

export default DetailsTab;
