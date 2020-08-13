import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  SVGS,
  COLORS,
  JOB_DATE,
  JOB_STATUS,
  SIZE1,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
  ItemWrap,
} from 'src/components';

import {
  Container,
  ShadowWrap,
  FullImage,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
  FailJob,
} from 'src/styles/header.styles';

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
} = SVGS;

const JobDetailsScreenView = ({
  loading,
  photos,
  sign,
  signedUserName,
  signedUserContact,
  binNumber1,
  setBinNumber1,
  binNumber2,
  setBinNumber2,
  jobStatus,

  focusedJob,

  onBack,
  onAcknowledge,
  onStart,
  onExchange,
  onComplete,
  onPhoto,
  onSign,
  onFail,
}) => {
  const [ binIndex, setBinIndex ] = useState(0);

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
          focusedJob.steps[1].wasteType || focusedJob.steps[1].binType
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
          <BinInfoRow>
            <BinText numberOfLines={2}>
              {
                focusedJob.steps[binIndex].wasteType &&
                focusedJob.steps[binIndex].wasteType.wasteTypeName
              }
            </BinText>
          </BinInfoRow>
          <BinInfoRow>
            <BinText numberOfLines={2}>
              {
                focusedJob.steps[binIndex].binType &&
                focusedJob.steps[binIndex].binType.binTypeName
              }
            </BinText>
          </BinInfoRow>
          <BinInfoRow>
            {
              binIndex === 0
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

JobDetailsScreenView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.string,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binNumber1: PropTypes.string.isRequired,
  setBinNumber1: PropTypes.func.isRequired,
  binNumber2: PropTypes.string.isRequired,
  setBinNumber2: PropTypes.func.isRequired,
  jobStatus: PropTypes.string.isRequired,

  focusedJob: PropTypes.object.isRequired,

  onBack: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onExchange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: '',
  signedUserName: '',
  signedUserContact: '',
};

export default JobDetailsScreenView;
