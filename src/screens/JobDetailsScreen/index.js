import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks';

import {
  JOB_STATUS,
  COMPLETE_JOBS_KEY,
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
  addItemToCache,
  removeItemFromCache,
  getCacheIds,
  getTimestamp,
} from 'src/utils';

import JobDetailsScreenView from './view';

const JobDetailsScreen = ({
  focusedJob,
  photosAndSign,
  newCommentInfo,
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
  setNewCommentInfo,
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
        jobStepId, wasteType, binType, binNumber, binWeight,
      } = focusedJob.steps[index];

      return {
        jobStepId, wasteType, binType, binNumber, binWeight,
      };
    })
  );

  const [ jobStatus, setJobStatus ] = useState(focusedJob.status.jobStatusName);

  const [ amountCollected, setAmountCollected ] = useState(
    focusedJob.collectedAmount || focusedJob.amountToCollect
  );

  useEffect(() => {
    checkIsInBackgroundMode();
  }, []);

  useNavigationComponentDidAppear((event) => {
    const { componentName } = event;

    setCoreScreenInfo({
      componentId,
      componentName,
      componentType: 'push',
    });
  });

  const checkIsInBackgroundMode = async () => {
    try {
      const { jobId, jobNumber } = focusedJob;

      const ids = await getCacheIds(BACKGROUND_FETCH_KEY);
      const index = ids.findIndex(id => id.jobId === jobId);
      if (index !== -1) {
        if (
          jobStatus === JOB_STATUS.COMPLETED ||
          jobStatus === JOB_STATUS.FAILED ||
          jobStatus === JOB_STATUS.CANCELLED
        ) {
          await removeItemFromCache(
            BACKGROUND_FETCH_KEY,
            { jobId, jobNumber },
          );

          await addItemToCache(
            COMPLETE_JOBS_KEY,
            { jobId, jobNumber },
            {
              timestamp: getTimestamp(),
              status: JOB_STATUS.COMPLETED,
            }
          );
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
        jobStepId, wasteType, binType, binNumber, binWeight,
      } = binInfo[index];

      return {
        jobStepId: jobStepId,
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

    if (focusedJob.mustTakeSignature && !(sign && sign.uri)) {
      Alert.alert('Warning', 'Please upload signature.');
      return;
    }

    if (isInBackgroundMode) {
      Alert.alert(
        'Warning',
        'This job is in background mode. Are you sure?',
        [
          {
            text: 'Cancel',
          },
          {
            text: 'OK',
            onPress: onCompleteJobs,
          },
        ],
        { cancelable: false },
      )
    } else {
      onCompleteJobs();
    }
  };

  const onCompleteJobsSuccess = async () => {
    try {
      const { jobId, jobNumber } = focusedJob;

      await removeItemFromCache(
        BACKGROUND_FETCH_KEY,
        { jobId, jobNumber },
      );

      await addItemToCache(
        COMPLETE_JOBS_KEY,
        { jobId, jobNumber },
        {
          timestamp: getTimestamp(),
          status: JOB_STATUS.COMPLETED,
        }
      );

      onBack();
    } catch (error) {
      //
    }
  };

  const onCompleteJobs = () => {
    setLoading(true);

    completeJobs({
      jobIds: `${focusedJob.jobId}`,
      stepBinUpdate: getUpdatedBinInfo(),
      photos,
      sign,
      signedUserName,
      signedUserContact,
      amountCollected,
      success: onCompleteJobsSuccess,
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

  const onCancelPhoto = (index) => {
    const newPhotos = photos.slice(0);
    newPhotos.splice(index, 1);

    setPhotos(newPhotos);
  };

  const onCancelSign = () => {
    setSign(photosAndSign.sign);

    setSignedUserName(photosAndSign.signedUserName);
    setSignedUserContact(photosAndSign.signedUserContact);
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
    />
  );
};

JobDetailsScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  photosAndSign: PropTypes.object.isRequired,
  newCommentInfo: PropTypes.object.isRequired,
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
  setNewCommentInfo: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

JobDetailsScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    photosAndSign: Jobs.selectors.getPhotosAndSign(state),
    newCommentInfo: ViewStore.selectors.getNewCommentInfo(state),
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
  setNewCommentInfo: ViewStore.actionCreators.setNewCommentInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);
