import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import {
  JOB_STATUS,
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
  uploadPhotos,
  uploadSign,
  initJobPhotosAndSign,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);

  const [ photos, setPhotos ] = useState(photosAndSign.photos);
  const [ sign, setSign ] = useState(photosAndSign.sign);

  const [ signedUserName, setSignedUserName ] = useState(photosAndSign.signedUserName);
  const [ signedUserContact, setSignedUserContact ] = useState(photosAndSign.signedUserContact);

  const [ binInfo1, setBinInfo1 ] = useState({
    wasteType: focusedJob.steps[0].wasteType,
    binType: focusedJob.steps[0].binType,
    binNumber: focusedJob.steps[0].binNumber,
    binWeight: focusedJob.steps[0].binWeight,
  });
  const [ binInfo2, setBinInfo2 ] = useState({
    wasteType: focusedJob.steps[1].wasteType,
    binType: focusedJob.steps[1].binType,
    binNumber: focusedJob.steps[1].binNumber,
    binWeight: focusedJob.steps[1].binWeight,
  });

  const [ jobStatus, setJobStatus ] = useState(focusedJob.status.jobStatusName);

  const [ amountCollected, setAmountCollected ] = useState(`${focusedJob.collectedAmount}`);

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

  const getUpdatedBinInfo = () => {
    return [
      {
        jobStepId: focusedJob.steps[0].jobStepId,
        wasteTypeId: binInfo1['wasteType'] && binInfo1['wasteType'].wasteTypeId,
        binTypeId: binInfo1['binType'] && binInfo1['binType'].binTypeId,
        binNumber: binInfo1['binNumber'],
        binWeight: binInfo1['binWeight'],
      },
      {
        jobStepId: focusedJob.steps[1].jobStepId,
        wasteTypeId: binInfo2['wasteType'] && binInfo2['wasteType'].wasteTypeId,
        binTypeId: binInfo2['binType'] && binInfo2['binType'].binTypeId,
        binNumber: binInfo2['binNumber'],
        binWeight: binInfo2['binWeight'],
      }
    ];
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
      stepBinUpdate: getUpdatedBinInfo(),
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

  const onFail = () => {
    pushScreen(componentId, FAIL_JOB_SCREEN);
  };

  const onUpdateService = (service) => {
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
    updateAmountCollected({
      jobIds: `${focusedJob.jobId}`,
      amountCollected: +amount,
    });
  };

  return (
    <JobDetailsScreenView
      loading={loading}
      photos={photos}
      sign={sign}
      signedUserName={signedUserName}
      signedUserContact={signedUserContact}
      binInfo1={binInfo1}
      setBinInfo1={setBinInfo1}
      binInfo2={binInfo2}
      setBinInfo2={setBinInfo2}
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
  uploadPhotos: PropTypes.func.isRequired,
  uploadSign: PropTypes.func.isRequired,
  initJobPhotosAndSign: PropTypes.func.isRequired,
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
  uploadPhotos: ViewStore.actionCreators.uploadPhotos,
  uploadSign: ViewStore.actionCreators.uploadSign,
  initJobPhotosAndSign: ViewStore.actionCreators.initJobPhotosAndSign,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);
