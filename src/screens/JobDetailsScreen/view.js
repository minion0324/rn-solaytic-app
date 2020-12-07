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
  jobStatus,
  services,
  cashIndex,
  setCashIndex,
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
  onCancelSign,
  onUpdateAmountCollected,
  onAlertNotProgress,
  onFail,
  onAddress,
  onDriverNote,
  onAddServices,
  onBinInfo,
  onPrint,
}) => {

  const getBinInOutInfoIndex = (index) => {
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
  };

  const getCustomerSiteIndex = () => {
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
  };

  return (
    jobStatus === JOB_STATUS.ACKNOWLEDGED ||
    jobStatus === JOB_STATUS.STARTED ||
    jobStatus === JOB_STATUS.IN_PROGRESS ||
    JOB_STATUS.FOR_ACKNOWLEDGE.includes(jobStatus)
  )
    ? <ProgressView
        loading={loading}
        photos={photos}
        sign={sign}
        signedUserName={signedUserName}
        signedUserContact={signedUserContact}
        binInfo={binInfo}
        jobStatus={jobStatus}
        services={services}
        cashIndex={cashIndex}
        setCashIndex={setCashIndex}
        isInProgress={isInProgress}

        focusedJob={focusedJob}

        onBack={onBack}
        onAcknowledge={onAcknowledge}
        onStart={onStart}
        onPull={onPull}
        onExchange={onExchange}
        onComplete={onComplete}
        onPhoto={onPhoto}
        onSign={onSign}
        onCancelPhoto={onCancelPhoto}
        onCancelSign={onCancelSign}
        onUpdateAmountCollected={onUpdateAmountCollected}
        onAlertNotProgress={onAlertNotProgress}
        onFail={onFail}
        onAddress={onAddress}
        onDriverNote={onDriverNote}
        onAddServices={onAddServices}
        onBinInfo={onBinInfo}
        onPrint={onPrint}

        getBinInOutInfoIndex={getBinInOutInfoIndex}
        getCustomerSiteIndex={getCustomerSiteIndex}
      />
    : <CompleteView
        photos={photos}
        sign={sign}
        signedUserName={signedUserName}
        signedUserContact={signedUserContact}
        binInfo={binInfo}
        jobStatus={jobStatus}
        services={services}

        focusedJob={focusedJob}

        onBack={onBack}
        onPrint={onPrint}

        getBinInOutInfoIndex={getBinInOutInfoIndex}
        getCustomerSiteIndex={getCustomerSiteIndex}
      />
};

JobDetailsScreenView.propTypes = {
  loading: PropTypes.bool.isRequired,
  photos: PropTypes.array.isRequired,
  sign: PropTypes.object,
  signedUserName: PropTypes.string,
  signedUserContact: PropTypes.string,
  binInfo: PropTypes.array.isRequired,
  jobStatus: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  cashIndex: PropTypes.number.isRequired,
  setCashIndex: PropTypes.func.isRequired,
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
  onCancelSign: PropTypes.func.isRequired,
  onUpdateAmountCollected: PropTypes.func.isRequired,
  onAlertNotProgress: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired,
  onAddress: PropTypes.func.isRequired,
  onDriverNote: PropTypes.func.isRequired,
  onAddServices: PropTypes.func.isRequired,
  onBinInfo: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
};

JobDetailsScreenView.defaultProps = {
  sign: null,
  signedUserName: '',
  signedUserContact: '',
};

export default JobDetailsScreenView;
