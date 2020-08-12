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

  const getUpdatedBinInfo = () => {
    return [
      {
        jobStepId: focusedJob.steps[0].jobStepId,
        binNumber: binNumber1,
      },
      {
        jobStepId: focusedJob.steps[1].jobStepId,
        binNumber: binNumber2,
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

  const onMessage = () => {
    pushScreen(componentId, FAIL_JOB_SCREEN);
  };

  const onService = () => {

  };

  return (
    <JobDetailsScreenView
      index={index}
      setIndex={setIndex}
      loading={loading}
      photos={photos}
      sign={sign}
      signedUserName={signedUserName}
      signedUserContact={signedUserContact}
      binNumber1={binNumber1}
      setBinNumber1={setBinNumber1}
      binNumber2={binNumber2}
      setBinNumber2={setBinNumber2}
      jobStatus={jobStatus}

      focusedJob={focusedJob}

      onBack={onBack}
      onAcknowledge={onAcknowledge}
      onStart={onStart}
      onExchange={onExchange}
      onComplete={onComplete}
      onPhoto={onPhoto}
      onSign={onSign}
      onMessage={onMessage}
      onService={onService}
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
