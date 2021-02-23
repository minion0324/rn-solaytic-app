import React from 'react';
import {
  FlatList,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';

const ListWrap = ({
  data,
  keyExtractor,
  renderItem,
  onRefreshProcess,
  refreshing,
  onEndProcess,
}) => {
  return (
    <FlatList
      bounces={false}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshProcess}
        />
      }
      onEndReached={onEndProcess}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
};

ListWrap.propTypes = {
  data: PropTypes.array.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  onRefreshProcess: PropTypes.func,
  refreshing: PropTypes.bool,
  onEndProcess: PropTypes.func,
};

ListWrap.defaultProps = {
  onRefreshProcess: null,
  refreshing: false,
  onEndProcess: null,
};

export default ListWrap;
