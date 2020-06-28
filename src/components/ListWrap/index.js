import React, { useCallback } from 'react';
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

  const onRefresh = useCallback(() => {
    onRefreshProcess && onRefreshProcess();
  }, [refreshing]);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onEndProcess}
          onEndReachedThreshold={0.5}
        />
      }
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
