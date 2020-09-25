import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  HeaderBar,
} from 'src/components';
import {
  popScreen,
} from 'src/navigation';
import {
  SVGS,
  COLORS,
  SIZE1,
  SIZE2,
} from 'src/constants';

import {
  Container,
  Content,
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
  InfoText,
} from 'src/styles/text.styles';

import {
  ServiceRow,
} from './styled';

const {
  ServiceIcon,
  ActiveCircleCheckIcon,
  DeactiveCircleCheckIcon,
} = SVGS;

const AddServicesScreen = ({
  services,
  componentId,
}) => {

  const onBack = () => {
    popScreen(componentId);
  };

  const renderServiceItem = ({ item, index }) => {
    return (
      <ServiceRow
        key={`${item.serviceAdditionalChargeId}`}
        onPress={() => onUpdateService(item, index)}
      >
        {
          item.isSelected
          ? <ActiveCircleCheckIcon />
          : <DeactiveCircleCheckIcon />
        }
        <SpaceView mLeft={SIZE2} />
        <InfoText>{item.serviceAdditionalChargeName}</InfoText>
      </ServiceRow>
    );
  };

  return (
    <Container>
      <ShadowWrap>
        <HeaderBar
          centerIcon={
            <RowWrap>
              <ServiceIcon />
              <SpaceView mLeft={SIZE1} />
              <ScreenText>Add Services</ScreenText>
            </RowWrap>
          }
          leftIcon={<Back />}
          rightIcon={<EmptyWrap />}
          onPressLeft={onBack}
        />
      </ShadowWrap>

      <Content>
        <FlatList
          bounces={false}
          data={services}
          keyExtractor={(item) => `${item.serviceAdditionalChargeId}`}
          showsVerticalScrollIndicator={false}
          renderItem={renderServiceItem}
        />
      </Content>
    </Container>
  );
};

AddServicesScreen.propTypes = {
  services: PropTypes.array.isRequired,
  componentId: PropTypes.string.isRequired,
};

AddServicesScreen.defaultProps = {
  //
};

const mapStateToProps = (state) => {
  return {
    //
  };
};

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddServicesScreen);
