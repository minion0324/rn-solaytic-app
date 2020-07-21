import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';

import {
  SVGS,
  COLORS,
  JOB_DATE,
  JOB_STATUS,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
  ItemWrap,
} from 'src/components';
import {
  showOverlay,
  pushScreen,
  popScreen,
  SIGNATURE_SCREEN,
  FAIL_JOB_SCREEN,
} from 'src/navigation';

import {
  Container,
  ShadowWrap,
  FullImage,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  IconsWrap,
  IconButton,
  BackButton,
} from 'src/styles/header.styles';
import {
  Jobs,
  ViewStore,
} from 'src/redux';

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
  IdWrap,
  IdText,
  RowWrap,
  BinButtonWrap,
  BinButton,
  BinButtonText,
  BinInfoWrap,
  BinInfoRow,
  BinText,
  BinInput,
  InstructionsWrap,
  InstructionsContent,
  InstructionsText,
  PhotoAndSignWrap,
  PhotoAndSignText,
  AttachmentWrap,
  HalfWrap,
  SignInfo,
  SignInfoText,
} from './styled';

const {
  Location1Icon,
  Location2Icon,
  Location3Icon,
  CameraIcon,
  SignIcon,
  MessageIcon,
  PlusIcon,
} = SVGS;

const JobDetailsScreen = ({
  focusedJob,
  photosAndSign,
  acknowledgeJobs,
  startJobs,
  exchangeJobs,
  completeJobs,
  setCoreScreenInfo,
  uploadPhotos,
  uploadSign,
  initJobPhotosAndSign,
  componentId,
}) => {
  const [ index, setIndex ] = useState(0);
  const [ loading, setLoading ] = useState(false);

  const [ photos, setPhotos ] = useState(photosAndSign.photos);
  const [ sign, setSign ] = useState(photosAndSign.sign);

  const [ signedUserName, setSignedUserName ] = useState(photosAndSign.signedUserName);
  const [ signedUserContact, setSignedUserContact ] = useState(photosAndSign.signedUserContact);

  const [ binNumber1, setBinNumber1 ] = useState(focusedJob.steps[0].binNumber);
  const [ binNumber2, setBinNumber2 ] = useState(focusedJob.steps[1].binNumber);

  const [ jobStatus, setJobStatus ] = useState(focusedJob.status.jobStatusName);

  useEffect(() => {
    setCoreScreenInfo({
      componentId,
      componentType: 'push',
    });

    initJobPhotosAndSign();

    return () => {
      setCoreScreenInfo({});
    };
  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onAcknowledge = () => {
    setLoading(true);

    acknowledgeJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => {
        setLoading(false);
        setJobStatus(JOB_STATUS.ACKNOWLEDGED);
      },
      failure: () => setLoading(false),
    });
  };

  const onStart = () => {
    setLoading(true);

    startJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => {
        setLoading(false);
        setJobStatus(JOB_STATUS.IN_PROGRESS1);
      },
      failure: () => setLoading(false),
    });
  };

  const onExchange = () => {
    setLoading(true);

    exchangeJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => {
        setLoading(false);
        setJobStatus(JOB_STATUS.IN_PROGRESS2);
      },
      failure: () => setLoading(false),
    });
  };

  const onFailure = () => {
    setLoading(false);
    initJobPhotosAndSign();
  }

  const onUploadPhotos = () => {
    uploadPhotos({
      photos,
      success: onUploadSign,
      failure: onFailure,
    });
  }

  const onUploadSign = () => {
    uploadSign({
      sign,
      success: onCompleteJob,
      failure: onFailure,
    })
  }

  const onCompleteJob = () => {
    completeJobs({
      jobIds: `${focusedJob.jobId}`,
      signedUserName,
      signedUserContact,
      success: onBack,
      failure: onFailure,
    });
  }

  const onComplete = () => {
    if (!photos.length || !sign) {
      Alert.alert('Warning', 'Please upload photos & sign.');
      return;
    }

    if (!signedUserName || !signedUserContact) {
      Alert.alert('Warning', 'Please type signed user name & contact.');
      return;
    }

    setLoading(true);
    onUploadPhotos();
  };

  const onPhoto = () => {
    const options = {
      title: 'Select Your Photo',
      storageOptions: {
        skipBackup: true,
      },
      quality: 0.5,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        //
      } else if (response.error) {
        //
      } else {
        setPhotos([ ...photos, response.uri ]);
      }
    });
  };

  const onSign = () => {
    showOverlay(SIGNATURE_SCREEN, {
      setSign,
      signedUserName,
      setSignedUserName,
      signedUserContact,
      setSignedUserContact
    });
  };

  const onMessage = () => {
    pushScreen(componentId, FAIL_JOB_SCREEN);
  };

  const onService = () => {

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
      )
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
              {`${focusedJob.customer.contactPerson}  |  `}
            </InfoText>
            <IdWrap>
              <IdText>
                {focusedJob.customer.contactNumber}
              </IdText>
            </IdWrap>
          </RowWrap>
        </InfoWrap>
        <InfoWrap>
          <LabelText>Date & Time</LabelText>
          <InfoText>{`${jobDate.format('DD ddd')} | ${jobDate.format('hh:mm A')}`}</InfoText>
        </InfoWrap>
      </ContactInfo>
    );
  };

  const renderBinInfo = () => {
    return (
      <View>
        {
          focusedJob.steps[1].wasteType || focusedJob.steps[1].binType
          ? <BinButtonWrap>
              <BinButton
                active={index === 0}
                onPress={() => setIndex(0)}
              >
                <BinButtonText active={index === 0}>Bin1</BinButtonText>
              </BinButton>
              <BinButton
                active={index === 1}
                onPress={() => setIndex(1)}
              >
                <BinButtonText active={index === 1}>Bin2</BinButtonText>
              </BinButton>
            </BinButtonWrap>
          : <BinButtonWrap>
              <BinButton
                active={index === 0}
                onPress={() => setIndex(0)}
              >
                <BinButtonText active={index === 0}>Bin</BinButtonText>
              </BinButton>
            </BinButtonWrap>
        }
        <BinInfoWrap>
          <BinInfoRow>
            <BinText numberOfLines={2}>
              {focusedJob.steps[index].wasteType.wasteTypeName}
            </BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText numberOfLines={2}>
              {focusedJob.steps[index].binType.binTypeName}
            </BinText>
          </BinInfoRow>
          <BinInfoRow>
            {
              index === 0
              ? <BinInput
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={text => setBinNumber1(text)}
                  value={binNumber1}
                  editable={
                    jobStatus === JOB_STATUS.ACKNOWLEDGED ||
                    jobStatus === JOB_STATUS.IN_PROGRESS1 ||
                    jobStatus === JOB_STATUS.IN_PROGRESS2
                  }
                />
              : <BinInput
                  underlineColorAndroid={COLORS.TRANSPARENT1}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={text => setBinNumber2(text)}
                  value={binNumber2}
                  editable={
                    jobStatus === JOB_STATUS.ACKNOWLEDGED ||
                    jobStatus === JOB_STATUS.IN_PROGRESS1 ||
                    jobStatus === JOB_STATUS.IN_PROGRESS2
                  }
                />
            }
          </BinInfoRow>
        </BinInfoWrap>
      </View>
    );
  };

  const renderInstructions = () => {
    return (
      <InstructionsWrap>
        <InfoText>Instructions</InfoText>
        <InstructionsContent>
          <InstructionsText>
            {focusedJob.instructionToDrivers || ''}
          </InstructionsText>
        </InstructionsContent>
      </InstructionsWrap>
    );
  }

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
  }

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
    )
  }

  return (
    <Container>
      {
        JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
        ? <HeaderBar
            centerIcon={<ScreenText>{focusedJob.jobTypeName}</ScreenText>}
            leftIcon={<BackButton />}
            rightIcon={<EmptyWrap />}
            onPressLeft={onBack}
          />
        : <ShadowWrap>
            <HeaderBar
              centerIcon={<ScreenText>{focusedJob.jobTypeName}</ScreenText>}
              leftIcon={<BackButton />}
              rightIcon={
                jobStatus === JOB_STATUS.IN_PROGRESS1 ||
                jobStatus === JOB_STATUS.IN_PROGRESS2
                ? <IconsWrap>
                    <IconButton onPress={onMessage}><MessageIcon /></IconButton>
                    <IconButton onPress={onService}><PlusIcon /></IconButton>
                  </IconsWrap>
                : <EmptyWrap />
              }
              onPressLeft={onBack}
            />

            { renderButton() }
          </ShadowWrap>
      }

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <JobDetails>
          <ShadowWrap>
            <Content>
              { renderLocationInfo() }
              { renderContactInfo() }
              { renderBinInfo() }
              {
                !!focusedJob.instructionToDrivers &&
                renderInstructions()
              }
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
      </ScrollView>
    </Container>
  );
};

JobDetailsScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  photosAndSign: PropTypes.object.isRequired,
  acknowledgeJobs: PropTypes.func.isRequired,
  startJobs: PropTypes.func.isRequired,
  exchangeJobs: PropTypes.func.isRequired,
  completeJobs: PropTypes.func.isRequired,
  setCoreScreenInfo: PropTypes.func.isRequired,
  uploadPhotos: PropTypes.func.isRequired,
  uploadSign: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

JobDetailsScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    photosAndSign: Jobs.selectors.getPhotosAndSign(state),
  };
};

const mapDispatchToProps = {
  acknowledgeJobs: Jobs.actionCreators.acknowledgeJobs,
  startJobs: Jobs.actionCreators.startJobs,
  exchangeJobs: Jobs.actionCreators.exchangeJobs,
  completeJobs: Jobs.actionCreators.completeJobs,
  setCoreScreenInfo: ViewStore.actionCreators.setCoreScreenInfo,
  uploadPhotos: ViewStore.actionCreators.uploadPhotos,
  uploadSign: ViewStore.actionCreators.uploadSign,
  initJobPhotosAndSign: ViewStore.actionCreators.initJobPhotosAndSign,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);
