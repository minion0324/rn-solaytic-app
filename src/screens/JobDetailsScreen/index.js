import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import {
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks';
import { pick } from 'lodash';

import {
  JOB_STATUS,
  COMPLETE_JOBS_KEY,
  BACKGROUND_FETCH_KEY,
  JOB_DETAILS_KEY,
  JOB_DETAILS_LIMIT,
} from 'src/constants';
import {
  showLightBox,
  pushScreen,
  popScreen,
  SIGNATURE_SCREEN,
  FAIL_JOB_SCREEN,
  ADDRESS_SCREEN,
  DRIVER_NOTE_SCREEN,
  ADD_SERVICES_SCREEN,
  SCAN_CODE_SCREEN,
  PREVIEW_SCREEN,
  ADD_WASTE_TYPES_SCREEN,
} from 'src/navigation';
import {
  Jobs,
  ViewStore,
} from 'src/redux';
import {
  addItemToCache,
  removeItemFromCache,
  getCacheItemById,
  getCacheIds,
  getTimestamp,
} from 'src/utils';

import JobDetailsScreenView from './view';

const JobDetailsScreen = ({
  focusedJob,
  jobStatus,
  photosAndSign,
  newCommentInfo,
  coreScreenInfo,
  acknowledgeJobs,
  startJobs,
  pullJobs,
  exchangeJobs,
  completeJobs,
  setCoreScreenInfo,
  setIsRequiredUpdateTab,
  getJobDates,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);

  const [ isInBackgroundMode, setIsInBackgroundMode ] = useState(false);

  const [ photos, setPhotos ] = useState(photosAndSign.photos);
  const [ sign, setSign ] = useState(photosAndSign.sign);

  const [ signedUserName, setSignedUserName ] = useState(photosAndSign.signedUserName);
  const [ signedUserContact, setSignedUserContact ] = useState(photosAndSign.signedUserContact);

  const [ binInfo, setBinInfo ] = useState(
    focusedJob.appExtraData && focusedJob.appExtraData.binInfo
    ? focusedJob.appExtraData.binInfo
    : [0, 1].map((index) => pick(
        focusedJob.steps[index],
        [
          'jobStepId',
          'wasteType',
          'binType',
          'binNumber',
          'binWeight',
          'wasteTypes',
        ],
      ))
  );

  const [ services, setServices ] = useState(
    focusedJob.appExtraData && focusedJob.appExtraData.services
    ? focusedJob.appExtraData.services : focusedJob.additionalCharges
  );

  const [ amountCollected, setAmountCollected ] = useState(
    focusedJob.appExtraData && focusedJob.appExtraData.amountCollected
    ? focusedJob.appExtraData.amountCollected : focusedJob.collectedAmount
  );

  const [ jobPaymentType, setJobPaymentType ] = useState(
    focusedJob.appExtraData && focusedJob.appExtraData.jobPaymentType
    ? focusedJob.appExtraData.jobPaymentType : focusedJob.jobPaymentType || 0
  );

  const isInProgress = useMemo(() => {
    return (
      jobStatus === JOB_STATUS.ACKNOWLEDGED ||
      jobStatus === JOB_STATUS.STARTED ||
      jobStatus === JOB_STATUS.IN_PROGRESS
    );
  }, [jobStatus]);

  useEffect(() => {
    getSavedPhotosAndSign();
    checkIsInBackgroundMode();
  }, []);

  useEffect(() => {
    onNewCommentInfo();
  }, [newCommentInfo]);

  useNavigationComponentDidAppear((event) => {
    const { componentName } = event;

    setCoreScreenInfo({
      componentId,
      componentName,
      componentType: 'push',
    });
  });

  useNavigationComponentDidDisappear(() => {
    saveJobDetailsInfo();
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

  const getSavedPhotosAndSign = async () => {
    try {
      const {
        value: { appExtraData },
      } = await getCacheItemById(JOB_DETAILS_KEY, { jobId: focusedJob.jobId });

      const {
        photosAndSign: {
          photos: savedPhotos,
          sign: savedSign,
          signedUserName: savedSignedUserName,
          signedUserContact: savedSignedUserContact,
        }
      } = appExtraData;

      if (photos.length <= 0 && savedPhotos.length > 0) {
        setPhotos(savedPhotos);
      }

      if (!sign.uri && savedSign.uri) {
        setSign(savedSign);

        setSignedUserName(savedSignedUserName);
        setSignedUserContact(savedSignedUserContact);
      }
    } catch (error) {
      //
    }
  };

  const saveJobDetailsInfo = async () => {
    try {
      const data = {
        ...focusedJob,
        appExtraData: {
          ...(focusedJob.appExtraData || {}),
          photosAndSign: {
            photos,
            sign,
            signedUserName,
            signedUserContact,
          },
        },
      };

      await addItemToCache(
        JOB_DETAILS_KEY,
        { jobId: focusedJob.jobId },
        data,
        JOB_DETAILS_LIMIT,
      );
    } catch (error) {
      //
    }
  };

  const onNewCommentInfo = () => {
    const { jobId } = newCommentInfo;

    if (
      +jobId === focusedJob.jobId &&
      coreScreenInfo.componentName !== DRIVER_NOTE_SCREEN
    ) {
      pushScreen(componentId, DRIVER_NOTE_SCREEN);
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
        getJobDates({});
        setIsRequiredUpdateTab(true);
        setLoading(false);
      },
      failure: () => setLoading(false),
    });
  };

  const onStart = () => {
    setLoading(true);

    startJobs({
      jobIds: `${focusedJob.jobId}`,
      binInfo,
      services,
      amountCollected,
      jobPaymentType,
      photos,
      sign,
      signedUserName,
      signedUserContact,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onPull = () => {
    setLoading(true);

    pullJobs({
      jobIds: `${focusedJob.jobId}`,
      binInfo,
      services,
      amountCollected,
      jobPaymentType,
      photos,
      sign,
      signedUserName,
      signedUserContact,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onExchange = () => {
    setLoading(true);

    exchangeJobs({
      jobIds: `${focusedJob.jobId}`,
      binInfo,
      services,
      amountCollected,
      jobPaymentType,
      photos,
      sign,
      signedUserName,
      signedUserContact,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  };

  const onComplete = () => {
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

      setLoading(false);
    } catch (error) {
      //
    }
  };

  const onCompleteJobs = () => {
    setLoading(true);

    completeJobs({
      jobIds: `${focusedJob.jobId}`,
      binInfo,
      services,
      amountCollected,
      jobPaymentType,
      photos,
      sign,
      signedUserName,
      signedUserContact,
      success: onCompleteJobsSuccess,
      failure: () => setLoading(false),
    });
  };

  const onPhoto = (jobStepId) => {
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
        setPhotos([ ...photos, { jobStepId, uri, data } ]);
      }
    });
  };

  const onSign = () => {
    showLightBox(SIGNATURE_SCREEN, {
      setSign,
      signedUserName,
      setSignedUserName,
      signedUserContact,
      setSignedUserContact,
      clearSign: onCancelSign,
    });
  };

  const onCancelPhoto = (selectedPhoto) => {
    const newPhotos = photos.filter((photo) => (
      photo.uri !== selectedPhoto.uri
    ));

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

  const onAddress = (customerSiteIndex) => {
    pushScreen(componentId, ADDRESS_SCREEN, { customerSiteIndex });
  };

  const onDriverNote = () => {
    pushScreen(componentId, DRIVER_NOTE_SCREEN);
  };

  const onAddServices = () => {
    pushScreen(componentId, ADD_SERVICES_SCREEN, {
      services, setServices,
    });
  };

  const onAddWasteTypes = (binIndex) => {
    pushScreen(componentId, ADD_WASTE_TYPES_SCREEN, {
      binIndex, binInfo, setBinInfo,
    });
  };

  const onScanCode = (binIndex) => {
    pushScreen(componentId, SCAN_CODE_SCREEN, {
      binIndex, binInfo, setBinInfo,
    });
  };

  const onPrint = (getBinInOutInfoIndex, getCustomerSiteIndex) => {
    pushScreen(componentId, PREVIEW_SCREEN, {
      sign, signedUserName, signedUserContact,
      binInfo, services, amountCollected, jobPaymentType,
      getBinInOutInfoIndex, getCustomerSiteIndex,
    });
  };

  return (
    <JobDetailsScreenView
      loading={loading}
      photos={photos}
      sign={sign}
      binInfo={binInfo}
      setBinInfo={setBinInfo}
      jobStatus={jobStatus}
      services={services}
      amountCollected={amountCollected}
      setAmountCollected={setAmountCollected}
      jobPaymentType={jobPaymentType}
      setJobPaymentType={setJobPaymentType}
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
      onFail={onFail}
      onAddress={onAddress}
      onDriverNote={onDriverNote}
      onAddServices={onAddServices}
      onAddWasteTypes={onAddWasteTypes}
      onScanCode={onScanCode}
      onPrint={onPrint}
    />
  );
};

JobDetailsScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  jobStatus: PropTypes.string.isRequired,
  photosAndSign: PropTypes.object.isRequired,
  newCommentInfo: PropTypes.object.isRequired,
  coreScreenInfo: PropTypes.object.isRequired,
  acknowledgeJobs: PropTypes.func.isRequired,
  startJobs: PropTypes.func.isRequired,
  pullJobs: PropTypes.func.isRequired,
  exchangeJobs: PropTypes.func.isRequired,
  completeJobs: PropTypes.func.isRequired,
  setCoreScreenInfo: PropTypes.func.isRequired,
  setIsRequiredUpdateTab: PropTypes.func.isRequired,
  getJobDates: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

JobDetailsScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    jobStatus: Jobs.selectors.getJobStatus(state),
    photosAndSign: Jobs.selectors.getPhotosAndSign(state),
    newCommentInfo: ViewStore.selectors.getNewCommentInfo(state),
    coreScreenInfo: ViewStore.selectors.getCoreScreenInfo(state),
  };
};

const mapDispatchToProps = {
  acknowledgeJobs: Jobs.actionCreators.acknowledgeJobs,
  startJobs: Jobs.actionCreators.startJobs,
  pullJobs: Jobs.actionCreators.pullJobs,
  exchangeJobs: Jobs.actionCreators.exchangeJobs,
  completeJobs: Jobs.actionCreators.completeJobs,
  setCoreScreenInfo: ViewStore.actionCreators.setCoreScreenInfo,
  setIsRequiredUpdateTab: ViewStore.actionCreators.setIsRequiredUpdateTab,
  getJobDates: ViewStore.actionCreators.getJobDates,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobDetailsScreen);
