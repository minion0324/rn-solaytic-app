import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';

import {
  JOB_STATUS,
  BACKGROUND_FETCH_KEY,
} from 'src/constants';
import {
  showOverlay,
  pushScreen,
  popScreen,
  SIGNATURE_SCREEN,
  FAIL_JOB_SCREEN,
} from 'src/navigation';
import {
  Jobs,
  ViewStore,
} from 'src/redux';
import {
  removeItem,
  getIds,
} from 'src/utils';

import JobDetailsScreenView from './view';

const JobDetailsScreen = ({
  focusedJob,
  photosAndSign,
  acknowledgeJobs,
  startJobs,
  exchangeJobs,
  completeJobs,
  addService,
  removeService,
  markMessagesAsRead,
  addMessage,
  updateAmountCollected,
  setCoreScreenInfo,
  setIsRequiredUpdateTab,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);

  const [ isInBackgroundMode, setIsInBackgroundMode ] = useState(false);

  const [ photos, setPhotos ] = useState(photosAndSign.photos);
  const [ sign, setSign ] = useState(photosAndSign.sign);

  const [ signedUserName, setSignedUserName ] = useState(photosAndSign.signedUserName);
  const [ signedUserContact, setSignedUserContact ] = useState(photosAndSign.signedUserContact);

  const [ binInfo, setBinInfo ] = useState(
    [0, 1].map((index) => {
      const {
        wasteType, binType, binNumber, binWeight,
      } = focusedJob.steps[index];

      return {
        wasteType, binType, binNumber, binWeight,
      };
    })
  );

  const [ jobStatus, setJobStatus ] = useState(focusedJob.status.jobStatusName);

  const [ amountCollected, setAmountCollected ] = useState(
    focusedJob.collectedAmount || focusedJob.amountToCollect
  );

  useEffect(() => {
    setCoreScreenInfo({
      componentId,
      componentType: 'push',
    });

    checkIsInBackgroundMode();

    return () => {
      setCoreScreenInfo({});
    };
  }, []);

  const checkIsInBackgroundMode = async () => {
    try {
      const { jobId, jobNumber } = focusedJob;

      const ids = await getIds(BACKGROUND_FETCH_KEY);
      const index = ids.findIndex(id => id.jobId === jobId);
      if (index !== -1) {
        if (
          jobStatus === JOB_STATUS.COMPLETED ||
          jobStatus === JOB_STATUS.FAILED ||
          jobStatus === JOB_STATUS.CANCELLED
        ) {
          await removeItem(BACKGROUND_FETCH_KEY, { jobId, jobNumber });
        } else {
          setIsInBackgroundMode(true);
          Toast.show('This job is in background mode.');
        }
      }
    } catch (error) {
      //
    }
  };

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
        setIsRequiredUpdateTab(true);
      },
      failure: () => setLoading(false),
    });
  };

  const getUpdatedBinInfo = () => {
    return [0, 1].map((index) => {
      const {
        wasteType, binType, binNumber, binWeight,
      } = binInfo[index];

      return {
        jobStepId: focusedJob.steps[index].jobStepId,
        wasteTypeId: wasteType && wasteType.wasteTypeId,
        binTypeId: binType && binType.binTypeId,
        binNumber: binNumber,
        binWeight: binWeight,
      }
    });
  };

  const onStart = () => {
    setLoading(true);

    startJobs({
      jobIds: `${focusedJob.jobId}`,
      stepBinUpdate: getUpdatedBinInfo(),
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
      stepBinUpdate: getUpdatedBinInfo(),
      success: () => {
        setLoading(false);
        setJobStatus(JOB_STATUS.IN_PROGRESS2);
      },
      failure: () => setLoading(false),
    });
  };

  const onComplete = () => {
    if (focusedJob.mustTakePhoto && photos.length === 0) {
      Alert.alert('Warning', 'Please upload photos.');
      return;
    }

    if (focusedJob.mustTakeSignature && !sign) {
      Alert.alert('Warning', 'Please upload signature.');
      return;
    }

    setLoading(true);

    completeJobs({
      jobIds: `${focusedJob.jobId}`,
      stepBinUpdate: getUpdatedBinInfo(),
      photos,
      sign,
      signedUserName,
      signedUserContact,
      amountCollected,
      success: onBack,
      failure: () => setLoading(false),
    });
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
        const { uri, data } = response;
        setPhotos([ ...photos, { uri, data } ]);
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

  const onFail = () => {
    pushScreen(componentId, FAIL_JOB_SCREEN);
  };

  const onUpdateService = (service) => {
    if (!onAlertNotProgress()) {
      return;
    }

    if (service.isSelected) {
      removeService({
        jobId: focusedJob.jobId,
        serviceId: service.serviceAdditionalChargeTemplateId,
      });
    } else {
      addService({
        jobId: focusedJob.jobId,
        serviceId: service.serviceAdditionalChargeTemplateId,
      });
    }
  };

  const onReadMessages = () => {
    markMessagesAsRead({
      jobId: focusedJob.jobId,
    });
  };

  const onNewComment = (message) => {
    addMessage({
      jobId: focusedJob.jobId,
      message,
    });
  };

  const onUpdateAmountCollected = (amount) => {
    if (!onAlertNotProgress()) {
      return;
    }

    updateAmountCollected({
      jobIds: `${focusedJob.jobId}`,
      amountCollected: +amount,
    });
  };

  const isInProgress = () => {
    return (
      jobStatus === JOB_STATUS.ACKNOWLEDGED ||
      jobStatus === JOB_STATUS.IN_PROGRESS1 ||
      jobStatus === JOB_STATUS.IN_PROGRESS2
    );
  };

  const onAlertNotProgress = () => {
    if (!isInProgress()) {
      Alert.alert('Warning', 'This job is not in progress now.');
      return false;
    }

    return true;
  };

  return (
    <JobDetailsScreenView
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

      focusedJob={focusedJob}

      onBack={onBack}
      onAcknowledge={onAcknowledge}
      onStart={onStart}
      onExchange={onExchange}
      onComplete={onComplete}
      onPhoto={onPhoto}
      onSign={onSign}
      onFail={onFail}
      onUpdateService={onUpdateService}
      onReadMessages={onReadMessages}
      onNewComment={onNewComment}
      onUpdateAmountCollected={onUpdateAmountCollected}
      isInProgress={isInProgress}
      onAlertNotProgress={onAlertNotProgress}
    />
  );
};

JobDetailsScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  photosAndSign: PropTypes.object.isRequired,
  acknowledgeJobs: PropTypes.func.isRequired,
  startJobs: PropTypes.func.isRequired,
  exchangeJobs: PropTypes.func.isRequired,
  completeJobs: PropTypes.func.isRequired,
  addService: PropTypes.func.isRequired,
  removeService: PropTypes.func.isRequired,
  markMessagesAsRead: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  updateAmountCollected: PropTypes.func.isRequired,
  setCoreScreenInfo: PropTypes.func.isRequired,
  setIsRequiredUpdateTab: PropTypes.func.isRequired,
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
  addService: Jobs.actionCreators.addService,
  removeService: Jobs.actionCreators.removeService,
  markMessagesAsRead: Jobs.actionCreators.markMessagesAsRead,
  addMessage: Jobs.actionCreators.addMessage,
  updateAmountCollected: Jobs.actionCreators.updateAmountCollected,
  setCoreScreenInfo: ViewStore.actionCreators.setCoreScreenInfo,
  setIsRequiredUpdateTab: ViewStore.actionCreators.setIsRequiredUpdateTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);
