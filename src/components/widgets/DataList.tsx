import React, {useCallback, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useImmerReducer} from 'use-immer';
import {ApiResponse} from '../../api/Api';
import theme from '../../styles/theme';
import {Document, Entity} from '../../types/DataTypes';
import dataListReducer, {initialState} from './dataListReducer';
import ListLoader from './ListLoader';
import NoDataFound from './NoDataFound';
export interface DataListProps<T> extends Omit<FlatListProps<T>, 'data'> {
  // extends FlatListProps<T> {
  itemsFunc: (lastDoc?: any) => Promise<ApiResponse<T> | undefined>;
  itemSize?: number | undefined;
  pageable?: boolean;
  refreshable?: boolean;
  lastDoc?: Document<T>;
  onLoadMore?: () => Promise<{data: T[]; doc: Document<T>}>;
  loaderStyle?: ViewStyle;
  // ListEmptyComponent?: React.ReactElement;
  hideNoDataFoundComponent?: boolean;
  HeaderComponent?: React.ReactElement;
  containerStyle?: ViewStyle;
  listStyle?: ViewStyle;
  onEndReached?: (info: any, length: number) => void;
}

function DataList<T extends Entity>({
  itemsFunc,
  itemSize,
  keyExtractor,
  pageable = false,
  horizontal,
  loaderStyle,
  HeaderComponent,
  containerStyle,
  listStyle,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  // hideNoDataFoundComponent = false,
  onEndReached,
  ...props
}: DataListProps<T>) {
  console.log('DataList render');
  const [state, dispatch] = useImmerReducer(dataListReducer, initialState);
  const {loading, reloading, items, lastDoc, hasMore} = state;

  useEffect(() => {
    const initData = async () => {
      dispatch({
        type: 'RESET',
        loading: true,
      });
      const response = await itemsFunc();
      dispatch({
        type: 'SET_ITEMS',
        items: response?.items,
        lastDoc:
          response?.items?.length === response?.query?.limit
            ? response?.lastDoc
            : undefined,
      });
    };
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsFunc]);

  const getItemLayout = useCallback(
    (data: T[] | null | undefined, index: number) => {
      return {
        length: itemSize!,
        offset: itemSize! * index,
        index,
      };
    },
    [itemSize],
  );

  const keyExtractorHandler = useCallback((item: T) => {
    return item.id;
  }, []);

  const loadMoreHandler = useMemo(
    () => async (info: {distanceFromEnd: number}) => {
      if (!pageable && onEndReached) {
        onEndReached(info, items?.length);
        return;
      }
      if (pageable && !reloading && !!lastDoc) {
        dispatch({
          type: 'SET_RELOADING',
          reloading: true,
        });
        const response = await itemsFunc(lastDoc);
        if (response) {
          const hasMoreData =
            !!response?.query?.limit &&
            !!response.lastDoc &&
            response.items?.length === response?.query?.limit;

          dispatch({
            type: 'LOAD_MORE_ITEMS',
            items: response.items,
            lastDoc: hasMoreData ? response.lastDoc : undefined,
          });
        } else {
          dispatch({
            type: 'FINISH_LOADING',
          });
        }
      }
    },
    [dispatch, items, itemsFunc, lastDoc, onEndReached, pageable, reloading],
  );

  const ListFooter = useCallback(() => {
    return pageable && hasMore && !loading ? (
      <View
        style={[
          styles.listFooter,
          horizontal ? styles.horizontalFooter : undefined,
        ]}>
        <ActivityIndicator color={theme.colors.salmon} size="large" />
      </View>
    ) : null;
  }, [hasMore, horizontal, loading, pageable]);

  const NoDataHandler = useCallback(() => {
    if (props.ListEmptyComponent) {
      return props.ListEmptyComponent as React.ReactElement;
    }
    return !loading && !reloading ? (
      <NoDataFound style={styles.noDataFound} />
    ) : null;
  }, [props.ListEmptyComponent, loading, reloading]);

  const separatorHandler = useCallback(
    () => <View style={horizontal ? styles.hSeparator : styles.vSeparator} />,
    [horizontal],
  );

  return !loading ? (
    items ? (
      <View style={[styles.container, containerStyle]}>
        {HeaderComponent}
        <FlatList
          {...props}
          style={[styles.flatList, listStyle]}
          horizontal={horizontal}
          // refreshing={false}
          // onRefresh={undefined}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          // }
          data={items}
          contentContainerStyle={
            !!items && items?.length === 0 ? styles.noData : undefined
          }
          getItemLayout={itemSize ? getItemLayout : undefined}
          keyExtractor={keyExtractor ?? keyExtractorHandler}
          onEndReachedThreshold={0.2}
          scrollEventThrottle={150}
          pagingEnabled={pageable}
          ListFooterComponent={ListFooter}
          onEndReached={loadMoreHandler}
          ListEmptyComponent={NoDataHandler}
          ItemSeparatorComponent={separatorHandler}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        />
      </View>
    ) : (
      <NoDataHandler />
    )
  ) : (
    <ListLoader style={loaderStyle} />
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  horizontal: {
    flexGrow: 0,
  },
  flatList: {
    // flexGrow: 0,
    // flex: 1,
  },
  listActivityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    flex: 1,
  },
  listFooter: {},
  horizontalFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vSeparator: {
    flex: 1,
    height: 10,
  },
  hSeparator: {
    flex: 1,
    width: 10,
  },
  noDataFound: {
    // width: '100%',
    // backgroundColor: 'grey',
  },
});

export default React.memo(DataList);
