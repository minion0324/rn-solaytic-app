import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  COLORS,
} from 'src/constants';
import {
  popScreen,
} from 'src/navigation';
import {
  HeaderBar,
  ListWrap,
  DefaultButton,
} from 'src/components';
import {
  Jobs,
  ViewStore,
} from 'src/redux';

import {
  Container,
  ShadowWrap,
  LoadingWrap,
} from 'src/styles/common.styles';
import {
  ScreenText,
  EmptyWrap,
  BackButton,
} from 'src/styles/header.styles';

import {
  ButtonWrap,
} from './styled';

const FailJobScreen = ({
  focusedJob,
  driverNotes,
  failJobs,
  getDriverNotes,
  componentId,
}) => {
  const [ loading, setLoading ] = useState(false);
  const [ refreshing, setRefreshing ] = useState(false);

  useEffect(() => {
    getDriverNotes({
      success: () => {},
      failure: () => {},
    });

  }, []);

  const onBack = () => {
    popScreen(componentId);
  };

  const onFail = () => {
    setLoading(true);

    failJobs({
      jobIds: `${focusedJob.jobId}`,
      success: () => setLoading(false),
      failure: () => setLoading(false),
    });
  }

  const onEnd = () => {

  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View />
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={<ScreenText>Fail Job</ScreenText>}
          leftIcon={<BackButton />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      {
        false
        ? <LoadingWrap>
            <ActivityIndicator size={'large'} />
          </LoadingWrap>
        : <ListWrap
            data={driverNotes}
            keyExtractor={(item) => `${item}`}
            renderItem={renderItem}
            onEndProcess={onEnd}
            onRefreshProcess={onRefresh}
            refreshing={refreshing}
          />
      }

      <ButtonWrap>
        <DefaultButton
          text={'Fail Job'}
          color={COLORS.RED1}
          onPress={onFail}
          loading={loading}
        />
      </ButtonWrap>
    </Container>
  );
};

FailJobScreen.propTypes = {
  focusedJob: PropTypes.object.isRequired,
  driverNotes: PropTypes.array.isRequired,
  failJobs: PropTypes.func.isRequired,
  getDriverNotes: PropTypes.func.isRequired,
  componentId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    focusedJob: Jobs.selectors.getFocusedJob(state),
    driverNotes: ViewStore.selectors.getDriverNotes(state),
  };
};

const mapDispatchToProps = {
  failJobs: Jobs.actionCreators.failJobs,
  getDriverNotes: ViewStore.actionCreators.getDriverNotes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FailJobScreen);
