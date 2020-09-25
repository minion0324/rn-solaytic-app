import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
  SIZE4,
  JOB_STATUS,
  JOB_TYPE,
} from 'src/constants';
import {
  HeaderBar,
  DefaultButton,
} from 'src/components';

import {
  Container,
  Content,
  ContentWrap,
  WrapBorder,
  ShadowWrap,
  RowWrap,
  FlexWrap,
  SpaceView,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  Back,
} from 'src/styles/header.styles';
import {
  TitleText,
  InfoText,
  LabelText,
} from 'src/styles/text.styles';

const {
  PersonContactIcon,
  NumberContactIcon,
  BlueRightArrowIcon,
  RedRightArrowIcon,
  DateIcon,
  TimeIcon,
  ChatIcon,
  ActiveBinInIcon,
  ActiveBinOutIcon,
  PaymentIcon,
  ServiceIcon,
  FailIcon,
  ImageIcon,
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
  amountCollected,
  setAmountCollected,
  services,

  focusedJob,
  newCommentInfo,
  setNewCommentInfo,

  onBack,
  onAcknowledge,
  onStart,
  onExchange,
  onComplete,
  onPhoto,
  onSign,
  onCancelPhoto,
  onCancelSign,
  onFail,
  onUpdateService,
  onReadMessages,
  onNewComment,
  onUpdateAmountCollected,
  isInProgress,
  onAlertNotProgress,
  onAddress,
  onDriverNote,
  onAddServices,
}) => {

  const getBinInOutIndex = (index) => {
    switch (focusedJob.jobTypeName) {
      case JOB_TYPE.PULL:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS2
        ) {
          return -1;
        }

        if (
          jobStatus === JOB_STATUS.DISPATCHED ||
          jobStatus === JOB_STATUS.ACKNOWLEDGED ||
          jobStatus === JOB_STATUS.IN_PROGRESS1
        ) {
          return 0;
        } else {
          return 1;
        }

      case JOB_TYPE.PUT:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS2
        ) {
          return -1;
        }

        if (jobStatus === JOB_STATUS.COMPLETED) {
          return 0;
        } else {
          return 1;
        }

      case JOB_TYPE.EXCHANGE:
        if (jobStatus === JOB_STATUS.COMPLETED) {
          return index === 0 ? 0 : 1;
        } else {
          return index === 0 ? 0 : 1;
        }

      case JOB_TYPE.OUT:
        if (index !== 0) {
          return -1;
        }

        if (jobStatus === JOB_STATUS.COMPLETED) {
          return 0;
        } else {
          return 1;
        }

      case JOB_TYPE.SHIFT:
        if (
          index !== 0 ||
          jobStatus === JOB_STATUS.IN_PROGRESS2
        ) {
          return -1;
        }

        if (jobStatus === JOB_STATUS.IN_PROGRESS1) {
          return 0;
        } else {
          return 1;
        }

      default:
        return '';
    };
  };

  const getContactStepIndex = () => {
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

    return stepIndex;
  };

  const getLocationStepIndex = () => {
    const { steps, jobTypeName } = focusedJob;

    if (jobTypeName === JOB_TYPE.PULL) {
      return 0;
    }

    if (jobTypeName === JOB_TYPE.PUT) {
      return 1;
    }

    if (steps.length === 2) {
      if (
        jobStatus === JOB_STATUS.DISPATCHED ||
        jobStatus === JOB_STATUS.ACKNOWLEDGED
      ) {
        return 0;
      }

      if (jobStatus === JOB_STATUS.IN_PROGRESS1) {
        return 1;
      }

      return 2;
    }

    if (steps.length === 3) {
      if (
        jobStatus === JOB_STATUS.DISPATCHED ||
        jobStatus === JOB_STATUS.ACKNOWLEDGED ||
        jobStatus === JOB_STATUS.IN_PROGRESS1
      ) {
        return 0;
      }

      return 1;
    }
  };

  const renderCustomerCopy = () => {
    const contactStepIndex = getContactStepIndex();

    const locationStepIndex = getLocationStepIndex();

    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <FlexWrap>
              <RowWrap>
                <SpaceView mLeft={SIZE2} />
                <TitleText>
                  Customer Copy
                </TitleText>
              </RowWrap>
            </FlexWrap>
            <FlexWrap>
              <TitleText>{focusedJob.jobNumber}</TitleText>
            </FlexWrap>
          </RowWrap>
        </ContentWrap>
        <WrapBorder />
        <ContentWrap>
          <LabelText>Customer</LabelText>
          <InfoText>
            {focusedJob.customer.customerName}
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <LabelText>Locations</LabelText>
          <InfoText>
            {focusedJob.steps[locationStepIndex].address}
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <LabelText>Contact</LabelText>
          <InfoText>
            {
              focusedJob.steps[contactStepIndex].contactPersonOne +
              '  |  ' +
              focusedJob.steps[contactStepIndex].contactNumberOne
            }
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <LabelText>Date & Time</LabelText>
          <InfoText>
            {
              moment(focusedJob.jobTimeSpecific || focusedJob.jobDate).format('DD MMM') +
              '  |  ' +
              moment(focusedJob.jobTimeSpecific || focusedJob.jobDate).format('hh:mm A')
            }
          </InfoText>

          <SpaceView mTop={SIZE2} />
          <RowWrap>
            <FlexWrap>
              <LabelText>Job Type</LabelText>
              <InfoText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </InfoText>
            </FlexWrap>
            <FlexWrap>
              <LabelText>Collections</LabelText>
              <InfoText>
                {amountCollected ? `$${amountCollected}` : ''}
              </InfoText>
            </FlexWrap>
          </RowWrap>

          <SpaceView mTop={SIZE2} />
          <RowWrap>
            <FlexWrap>
              <LabelText>Driver</LabelText>
              <InfoText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </InfoText>
            </FlexWrap>
            <FlexWrap>
              <LabelText>Vehicle</LabelText>
              <InfoText>
                {amountCollected ? `$${amountCollected}` : ''}
              </InfoText>
            </FlexWrap>
          </RowWrap>
        </ContentWrap>
      </View>
    );
  };

  const renderJobProof = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <ImageIcon />
            <SpaceView mLeft={SIZE2} />
            <TitleText>
              Job Proof
            </TitleText>
          </RowWrap>
        </ContentWrap>
        <WrapBorder />
        <ContentWrap>
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
        </ContentWrap>
      </View>
    );
  }

  const renderFailJob = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity onPress={onFail}>
          <ContentWrap>
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  <FailIcon />
                  <SpaceView mLeft={SIZE2} />
                  <TitleText>
                    Fail Job
                  </TitleText>
                </RowWrap>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
              <BlueRightArrowIcon />
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  const renderServices = () => {
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
              <SpaceView mLeft={SIZE2} />
              <BlueRightArrowIcon />
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPayments = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <RowWrap>
            <FlexWrap>
              <RowWrap>
                <PaymentIcon />
                <SpaceView mLeft={SIZE2} />
                <TitleText>
                  {'Payments' + (amountCollected ? `: Cash $${amountCollected}` : '')}
                </TitleText>
              </RowWrap>
            </FlexWrap>
            <SpaceView mLeft={SIZE2} />
            <BlueRightArrowIcon />
          </RowWrap>
        </ContentWrap>
      </View>
    );
  };

  const renderBinInfo = () => {
    return (
      binInfo.map((item, index) => {
        const binInOutIndex = getBinInOutIndex(index);

        return (
          (item.wasteType || item.binType) &&
          <View>
            <SpaceView mTop={SIZE2} />
            <ContentWrap>
              <RowWrap>
                {
                  binInOutIndex === 0 &&
                  <RowWrap>
                    <ActiveBinInIcon />
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                }
                {
                  binInOutIndex === 1 &&
                  <RowWrap>
                    <ActiveBinOutIcon />
                    <SpaceView mLeft={SIZE2} />
                  </RowWrap>
                }
                <TitleText>
                  {`Bin ${binInOutIndex === 0 ? 'In' : binInOutIndex === 1 ? 'Out' : ''}`}
                </TitleText>
              </RowWrap>
            </ContentWrap>
            <WrapBorder />
            <ContentWrap>
              <RowWrap>
                <FlexWrap>
                  <RowWrap>
                    <FlexWrap>
                      <LabelText>Waste Type</LabelText>
                      <InfoText>
                        {item['wasteType'] && item['wasteType']['wasteTypeName']}
                      </InfoText>
                    </FlexWrap>
                    {
                      focusedJob.isEnabledBinWeight &&
                      (!!item['binWeight'] || editable) &&
                      (
                        index !== 0 ||
                        focusedJob.jobTypeName !== JOB_TYPE.EXCHANGE
                      ) &&
                      <FlexWrap>
                        <LabelText>Nett Weight</LabelText>
                        <InfoText>
                          {item['binWeight']}
                        </InfoText>
                      </FlexWrap>
                    }
                  </RowWrap>
                  <SpaceView mTop={SIZE2} />
                  <RowWrap>
                    <FlexWrap>
                      <LabelText>Bin Type</LabelText>
                      <InfoText>
                        {item['binType'] && item['binType']['binTypeName']}
                      </InfoText>
                    </FlexWrap>
                    <FlexWrap>
                      <LabelText>Bin Id</LabelText>
                      <InfoText>
                        {item['binNumber']}
                      </InfoText>
                    </FlexWrap>
                  </RowWrap>
                </FlexWrap>
                <SpaceView mLeft={SIZE2} />
                <BlueRightArrowIcon />
              </RowWrap>
            </ContentWrap>
          </View>
        );
      })
    );
  };

  const renderDriverNote = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <TouchableOpacity onPress={onDriverNote}>
          <ContentWrap>
            <RowWrap>
              <ChatIcon />
              <SpaceView mLeft={SIZE2} />
              <TitleText>Driver Note</TitleText>
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
        <WrapBorder />
        <TouchableOpacity onPress={onDriverNote}>
          <ContentWrap>
            <RowWrap>
              <FlexWrap>
                <InfoText>
                  {focusedJob.instructions}
                </InfoText>
              </FlexWrap>
              <SpaceView mLeft={SIZE2} />
              <BlueRightArrowIcon />
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  const renderType = () => {
    return (
      <View>
        <SpaceView mTop={SIZE2} />
        <ContentWrap>
          <SpaceView mTop={SIZE1} />
          <RowWrap>
            <FlexWrap flex={4}>
              <TitleText>
                {focusedJob.jobTemplateName || focusedJob.jobTypeName}
              </TitleText>
            </FlexWrap>
            <FlexWrap flex={6}>
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
          </RowWrap>
          <SpaceView mTop={SIZE1} />
        </ContentWrap>
      </View>
    );
  };

  const renderContact = () => {
    const { steps } = focusedJob;

    const contactStepIndex = getContactStepIndex();

    return (
      <View>
        <RowWrap>
          <SpaceView mLeft={SIZE4} />
          <WrapBorder />
        </RowWrap>
        <TouchableOpacity
          onPress={() => onAddress(contactStepIndex)}
        >
          <ContentWrap>
            <RowWrap>
              <FlexWrap>
                <RowWrap>
                  <PersonContactIcon />
                  <SpaceView mLeft={SIZE2} />
                  <InfoText numberOfLines={1}>
                    {steps[contactStepIndex].contactPersonOne}
                  </InfoText>
                </RowWrap>
              </FlexWrap>
              <FlexWrap>
                <RowWrap>
                  <NumberContactIcon />
                  <SpaceView mLeft={SIZE2} />
                  <InfoText numberOfLines={1}>
                    {steps[contactStepIndex].contactNumberOne}
                  </InfoText>
                </RowWrap>
              </FlexWrap>
            </RowWrap>
          </ContentWrap>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLocation = () => {
    const { steps } = focusedJob;

    const locationStepIndex = getLocationStepIndex();

    return (
      <TouchableOpacity
        onPress={() => onAddress(locationStepIndex)}
      >
        <ContentWrap mTop={SIZE1}>
          <RowWrap>
            <FlexWrap>
              <InfoText>
                {steps[locationStepIndex].address}
              </InfoText>
            </FlexWrap>
            <SpaceView mLeft={SIZE2} />
            <BlueRightArrowIcon />
          </RowWrap>
        </ContentWrap>
      </TouchableOpacity>
    );
  };

  const renderButton = () => {
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

    if (jobStatus === JOB_STATUS.ACKNOWLEDGED) {
      return (
        <DefaultButton
          color={COLORS.BLUE1}
          text={'Start'}
          onPress={onStart}
          loading={loading}
        />
      );
    }

    if (
      focusedJob.steps.length === 3 &&
      jobStatus === JOB_STATUS.IN_PROGRESS1
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
      jobStatus === JOB_STATUS.IN_PROGRESS1 ||
      jobStatus === JOB_STATUS.IN_PROGRESS2
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
        centerIcon={renderButton()}
        leftIcon={<Back />}
        rightIcon={<EmptyWrap />}
        onPressLeft={onBack}
      />
    );
  };

  return (
    <Container>
      <ShadowWrap>
        { renderHeader() }
        { renderLocation() }
        { renderContact() }
      </ShadowWrap>

      <Content>
        <ScrollView>
          { renderType() }
          { renderDriverNote() }
          { renderBinInfo() }
          { renderPayments() }
          { renderServices() }
          { renderFailJob() }
          { renderJobProof() }
          { renderCustomerCopy() }

        {
          // <DetailsTab
          //   photos={photos}
          //   sign={sign}
          //   signedUserName={signedUserName}
          //   signedUserContact={signedUserContact}
          //   binInfo={binInfo}
          //   setBinInfo={setBinInfo}
          //   jobStatus={jobStatus}

          //   focusedJob={focusedJob}

          //   onPhoto={onPhoto}
          //   onSign={onSign}
          //   onCancelPhoto={onCancelPhoto}
          //   onCancelSign={onCancelSign}
          //   isInProgress={isInProgress}
          // />

          // <InstructionTab
          //   amountCollected={amountCollected}
          //   setAmountCollected={setAmountCollected}
          //   services={services}

          //   focusedJob={focusedJob}
          //   newCommentInfo={newCommentInfo}
          //   setNewCommentInfo={setNewCommentInfo}

          //   onUpdateService={onUpdateService}
          //   onReadMessages={onReadMessages}
          //   onNewComment={onNewComment}
          //   onUpdateAmountCollected={onUpdateAmountCollected}
          //   isInProgress={isInProgress}
          //   onAlertNotProgress={onAlertNotProgress}
          // />
        }

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
  amountCollected: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  setAmountCollected: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,

  focusedJob: PropTypes.object.isRequired,
  newCommentInfo: PropTypes.object.isRequired,
  setNewCommentInfo: PropTypes.func.isRequired,

  onBack: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onExchange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPhoto: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
  onCancelPhoto: PropTypes.func.isRequired,
  onCancelSign: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onUpdateService: PropTypes.func.isRequired,
  onReadMessages: PropTypes.func.isRequired,
  onNewComment: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  isInProgress: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
  onAddress: PropTypes.func.isRequired,
  onDriverNote: PropTypes.func.isRequired,
  onAddServices: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
  amountCollected: '',
};

export default JobDetailsScreenView;
