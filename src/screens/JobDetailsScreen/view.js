import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TabView, TabBar } from 'react-native-tab-view';
import ActionSheet from 'react-native-actionsheet';

import {
  SVGS,
  COLORS,
  JOB_DATE,
  JOB_STATUS,
  JOB_TYPE,
  SIZE1,
  SIZE2,
  SIZE10,
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
  ShadowWrap,
  FullImage,
  SpaceView,
  OkCancelRow,
  OkCancelButton,
  OkCancelText,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
  FailJob,
} from 'src/styles/header.styles';
import {
  TabBarBadge,
  TabBarStyle,
  TabBarIndicatorStyle,
  TabBarLabelStyle,
  TabBarActiveColor,
  TabBarInactiveColor,
} from 'src/styles/tab.styles';
import {
  ModalWrap,
  ModalTopText,
  ModalInput,
} from 'src/styles/modal.styles';

import {
  ButtonWrap,
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

  JobInstruction,
  CommentsWrap,
  Comment,
  CommentText,
  AddComment,
  CollectRow,
  CollectInputWrap,
  CollectInput,
  AddServices,
  ServicesWrap,
  ServiceRow,
} from './styled';

const {
  Location1Icon,
  Location2Icon,
  Location3Icon,
  CameraIcon,
  SignIcon,
  CommentIcon,
  ActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
  EditIcon,
} = SVGS;

const TAB1 = 'Details';
const TAB2 = 'Instruction';

const COMMENT = 'Comment';
const SERVICES = 'Services';

const UNIT = '$ ';

const JobDetailsScreenView = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binInfo,
  setBinInfo,
  jobStatus,
  amountCollected,
  setAmountCollected,

  focusedJob,

  onBack,
  onAcknowledge,
  onStart,
  onExchange,
  onComplete,
  onPhoto,
  onSign,
  onFail,
  onUpdateService,
  onReadMessages,
  onNewComment,
  onUpdateAmountCollected,
  isInProgress,
  onAlertNotProgress,
}) => {
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ tabRoutes ] = useState([
    { key: TAB1, title: TAB1 },
    { key: TAB2, title: TAB2 },
  ]);

  const [ binIndex, setBinIndex ] = useState(0);
  const [ active, setActive ] = useState(COMMENT);

  const [ chargeIndex, setChargeIndex ] = useState(-1);

  const [ actionSheetData, setActionSheetData ] = useState([]);

  const actionSheetRef = useRef(null);
  const actionSheetKey = useRef(null);

  const inputBinWeight = useRef(null);

  const onAddComment = () => {
    if (!onAlertNotProgress()) {
      return;
    }

    showOverlay(CUSTOM_MODAL_SCREEN, {
      offsetFromCenter: SIZE10,
      dismissible: false,
      getContent: renderCommentModal,
    });
  };

  const onDismissModal = async (containerId) => {
    Keyboard.dismiss();

    await delay(100);
    dismissOverlay(containerId);
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

  const onTapPress = ({ route }) => {
    if (
      route.key === TAB1 ||
      !focusedJob.haveUnreadMessage
    ) {
      return;
    }

    onReadMessages();
  };

  const renderCommentModal = (containerId, { modalData, setModalData }) => {
    return (
      <ModalWrap>
        <ModalTopText>Enter a comment</ModalTopText>
        <ModalInput
          underlineColorAndroid={COLORS.TRANSPARENT1}
          autoCapitalize={'none'}
          autoCorrect={false}
          onChangeText={text => setModalData(text)}
          value={modalData}
        />
        <OkCancelRow>
          <OkCancelButton
            onPress={() => {
              onDismissModal(containerId);
            }}
          >
            <OkCancelText>Cancel</OkCancelText>
          </OkCancelButton>
          <OkCancelButton
            onPress={() => {
              onNewComment(modalData);
              onDismissModal(containerId);
            }}
          >
            <OkCancelText>Ok</OkCancelText>
          </OkCancelButton>
        </OkCancelRow>
      </ModalWrap>
    );
  };

  const renderComments = () => {
    if (active !== COMMENT) {
      return (
        <View>
          <SpaceView mTop={SIZE2} />
          <ShadowWrap>
            <Content>
              <AddComment onPress={() => setActive(COMMENT)}>
                <CommentIcon />
                <SpaceView mLeft={SIZE1} />
                <InfoText>ADD COMMENT</InfoText>
              </AddComment>
            </Content>
          </ShadowWrap>
        </View>
      );
    }

    return (
      <ShadowWrap>
        <Content>
          {
            focusedJob.messages.length > 0 &&
            <CommentsWrap>
              {
                focusedJob.messages.map((item) => (
                  <Comment
                    key={item.jobMessageId}
                    pos={item.type && 'right'}
                  >
                    <CommentText
                      pos={item.type && 'right'}
                    >
                      {item.message}
                    </CommentText>
                  </Comment>
                ))
              }
            </CommentsWrap>
          }
          <AddComment onPress={onAddComment}>
            <CommentIcon />
            <SpaceView mLeft={SIZE1} />
            <InfoText>ADD COMMENT</InfoText>
          </AddComment>
        </Content>
      </ShadowWrap>
    );
  };

  const renderCollect = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ShadowWrap>
          <Content>
            <CollectRow>
              <InfoText>COLLECT</InfoText>
              <CollectInputWrap>
                <CollectInput
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={text => setAmountCollected(text.replace(UNIT, ''))}
                  value={amountCollected ? `${UNIT}${amountCollected}` : amountCollected}
                  keyboardType={'numeric'}
                  editable={isInProgress()}
                />
              </CollectInputWrap>
            </CollectRow>
            <OkCancelRow>
              <OkCancelButton
                onPress={() => {
                  setAmountCollected(
                    `${focusedJob.collectedAmount || focusedJob.amountToCollect || ''}`
                  );
                }}
              >
                <OkCancelText>Cancel</OkCancelText>
              </OkCancelButton>
              <OkCancelButton
                onPress={() => onUpdateAmountCollected(amountCollected)}
              >
                <OkCancelText>Ok</OkCancelText>
              </OkCancelButton>
            </OkCancelRow>
          </Content>
        </ShadowWrap>
      </View>
    );
  };

  const renderServices = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ShadowWrap>
          <Content>
            <AddServices onPress={() => setActive(SERVICES)}>
              <InfoText>ADD SERVICES</InfoText>
            </AddServices>
            {
              active === SERVICES &&
              <ServicesWrap>
                {
                  focusedJob.additionalCharges.map((item) => (
                    <ServiceRow
                      key={`${item.serviceAdditionalChargeId}`}
                      onPress={() => onUpdateService(item)}
                    >
                      {
                        item.isSelected
                        ? <ActiveCircleCheckIcon />
                        : <DeactiveCircleCheckIcon />
                      }
                      <SpaceView mLeft={SIZE2} />
                      <InfoText>{item.serviceAdditionalChargeName}</InfoText>
                    </ServiceRow>
                  ))
                }
              </ServicesWrap>
            }
          </Content>
        </ShadowWrap>
      </View>
    );
  };

  const renderJobInstruction = () => {
    return (
      <JobInstruction>
        { renderComments() }

        {
          focusedJob.isEnabledCashCollection &&
          renderCollect()
        }

        {
          focusedJob.additionalCharges.length > 0 &&
          renderServices()
        }
      </JobInstruction>
    );
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
          <LabelText>Customer</LabelText>
          <InfoText>{focusedJob.customer.customerName}</InfoText>
        </InfoWrap>
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
            <NumberText>
              {
                focusedJob.steps[stepIndex].contactNumberOne
                || focusedJob.customer.contactNumber
              }
            </NumberText>
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
                <NumberText>
                  {focusedJob.steps[stepIndex].contactNumberTwo}
                </NumberText>
              </RowWrap>
            </View>
          }
        </InfoWrap>
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

  const renderJobDetails = () => {
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

  const renderButton = () => {
    if (jobStatus === JOB_STATUS.ACKNOWLEDGED) {
      return (
        <ButtonWrap>
          <DefaultButton
            color={COLORS.BLUE1}
            text={'Start'}
            onPress={onStart}
            loading={loading}
          />
        </ButtonWrap>
      );
    }

    if (
      jobStatus === JOB_STATUS.IN_PROGRESS1 &&
      focusedJob.steps.length === 3
    ) {
      return (
        <ButtonWrap>
          <DefaultButton
            color={COLORS.PURPLE1}
            text={'Exchange'}
            onPress={onExchange}
            loading={loading}
          />
        </ButtonWrap>
      );
    }

    if (
      jobStatus === JOB_STATUS.IN_PROGRESS1 ||
      jobStatus === JOB_STATUS.IN_PROGRESS2
    ) {
      return (
        <ButtonWrap>
          <DefaultButton
            color={COLORS.GREEN1}
            text={'Complete'}
            onPress={onComplete}
            loading={loading}
          />
        </ButtonWrap>
      );
    }

    return null;
  };

  const renderHeader = () => {
    return (
      JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
      ? <HeaderBar
          centerIcon={
            <ScreenText>{focusedJob.jobTemplateName || focusedJob.jobTypeName}</ScreenText>
          }
          leftIcon={<BackButton />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      : <ShadowWrap>
          <HeaderBar
            centerIcon={
              <ScreenText>{focusedJob.jobTemplateName || focusedJob.jobTypeName}</ScreenText>
            }
            leftIcon={<BackButton />}
            rightIcon={
              jobStatus === JOB_STATUS.IN_PROGRESS1 ||
              jobStatus === JOB_STATUS.IN_PROGRESS2
              ? <FailJob />
              : <EmptyWrap />
            }
            onPressLeft={onBack}
            onPressRight={
              jobStatus === JOB_STATUS.IN_PROGRESS1 ||
              jobStatus === JOB_STATUS.IN_PROGRESS2
              ? onFail
              : null
            }
          />

          { renderButton() }
        </ShadowWrap>
    );
  };

  const renderScene = ({ route }) => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
          {
            route.key === TAB1
            ? renderJobDetails()
            : renderJobInstruction()
          }
      </ScrollView>
    );
  };

  const renderBadge = ({ route }) => {
    if (
      route.key === TAB1 ||
      !focusedJob.haveUnreadMessage
    ) {
      return null;
    }

    return (
      <TabBarBadge />
    );
  };

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        getLabelText={({ route }) => route.title}
        style={TabBarStyle}
        indicatorStyle={TabBarIndicatorStyle}
        labelStyle={TabBarLabelStyle}
        activeColor={TabBarActiveColor}
        inactiveColor={TabBarInactiveColor}
        renderBadge={renderBadge}
        onTabPress={onTapPress}
      />
    );
  };

  return (
    <Container>
      { renderHeader() }

      <TabView
        navigationState={{
          index: tabIndex, routes: tabRoutes
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={idx => setTabIndex(idx)}
        useNativeDriver
      />
    </Container>
  );
};

JobDetailsScreenView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.string,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  setBinInfo: PropTypes.func.isRequired,
  jobStatus: PropTypes.string.isRequired,
  amountCollected: PropTypes.string,
  setAmountCollected: PropTypes.func.isRequired,

  focusedJob: PropTypes.object.isRequired,

  onBack: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onExchange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onUpdateService: PropTypes.func.isRequired,
  onReadMessages: PropTypes.func.isRequired,
  onNewComment: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  isInProgress: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: '',
  signedUserName: '',
  signedUserContact: '',
  amountCollected: '',
};

export default JobDetailsScreenView;
