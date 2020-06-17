import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';

const ListContainer = ({
  data,
  keyExtractor,
  renderItem,
  onRefreshProcess,
  refreshing,
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
        />
      }
    />
  );
};

ListContainer.propTypes = {
  data: PropTypes.array.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  onRefreshProcess: PropTypes.func,
  refreshing: PropTypes.bool,
};

ListContainer.defaultProps = {
  onRefreshProcess: null,
  refreshing: false,
};

export default ListContainer;
