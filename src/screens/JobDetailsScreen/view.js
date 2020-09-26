import React from 'react';
import PropTypes from 'prop-types';

import {
  JOB_STATUS,
  JOB_TYPE,
} from 'src/constants';

import {
  ProgressView,
  CompleteView,
} from './components';

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
  onBinInfo,
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

  return (
    jobStatus === JOB_STATUS.ACKNOWLEDGED ||
    jobStatus === JOB_STATUS.IN_PROGRESS1 ||
    jobStatus === JOB_STATUS.IN_PROGRESS2 ||
    JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
  )
    ? <ProgressView
        loading={loading}
        photos={photos}
        sign={sign}
        signedUserName={signedUserName}
        signedUserContact={signedUserContact}
        binInfo={binInfo}
        setBinInfo={setBinInfo}
        jobStatus={jobStatus}
        amountCollected={amountCollected}
        setAmountCollected={setAmountCollected}
        services={services}

        focusedJob={focusedJob}
        newCommentInfo={newCommentInfo}
        setNewCommentInfo={setNewCommentInfo}

        onBack={onBack}
        onAcknowledge={onAcknowledge}
        onStart={onStart}
        onExchange={onExchange}
        onComplete={onComplete}
        onPhoto={onPhoto}
        onSign={onSign}
        onCancelPhoto={onCancelPhoto}
        onCancelSign={onCancelSign}
        onFail={onFail}
        onUpdateService={onUpdateService}
        onReadMessages={onReadMessages}
        onNewComment={onNewComment}
        onUpdateAmountCollected={onUpdateAmountCollected}
        isInProgress={isInProgress}
        onAlertNotProgress={onAlertNotProgress}
        onAddress={onAddress}
        onDriverNote={onDriverNote}
        onAddServices={onAddServices}
        onBinInfo={onBinInfo}

        getBinInOutIndex={getBinInOutIndex}
        getContactStepIndex={getContactStepIndex}
        getLocationStepIndex={getLocationStepIndex}
      />
    : <CompleteView
        loading={loading}
        photos={photos}
        sign={sign}
        signedUserName={signedUserName}
        signedUserContact={signedUserContact}
        binInfo={binInfo}
        setBinInfo={setBinInfo}
        jobStatus={jobStatus}
        amountCollected={amountCollected}
        setAmountCollected={setAmountCollected}
        services={services}

        focusedJob={focusedJob}
        newCommentInfo={newCommentInfo}
        setNewCommentInfo={setNewCommentInfo}

        onBack={onBack}
        onAcknowledge={onAcknowledge}
        onStart={onStart}
        onExchange={onExchange}
        onComplete={onComplete}
        onPhoto={onPhoto}
        onSign={onSign}
        onCancelPhoto={onCancelPhoto}
        onCancelSign={onCancelSign}
        onFail={onFail}
        onUpdateService={onUpdateService}
        onReadMessages={onReadMessages}
        onNewComment={onNewComment}
        onUpdateAmountCollected={onUpdateAmountCollected}
        isInProgress={isInProgress}
        onAlertNotProgress={onAlertNotProgress}
        onAddress={onAddress}
        onDriverNote={onDriverNote}
        onAddServices={onAddServices}
        onBinInfo={onBinInfo}

        getBinInOutIndex={getBinInOutIndex}
        getContactStepIndex={getContactStepIndex}
        getLocationStepIndex={getLocationStepIndex}
      />
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
  onBinInfo: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
  amountCollected: '',
};

export default JobDetailsScreenView;
