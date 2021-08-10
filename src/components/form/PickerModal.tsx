import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {FlatList, StatusBar, StyleSheet, View, ViewStyle} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useImmerReducer} from 'use-immer';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import {Entity, Nestable} from '../../types/DataTypes';
import {Icon, Text} from '../core';
import SearchInput from '../form/SearchInput';
import Breadcrumb from '../widgets/Breadcrumb';
import NoDataFound from '../widgets/NoDataFound';
import pickerReducer, {PickerState} from '../widgets/picker/pickerReducer';
import PickerItem from './PickerItem';

export interface PickerModalProps {
  items: Entity[];
  isModalVisible: boolean;
  style?: ViewStyle;
  onItemChange: (item: Entity) => void;
  onCloseModal: () => void;
  position?: 'bottom' | 'full';
  showHeaderLeft?: boolean;
  headerTitle?: string;
  defaultValue?: string;
  searchPlaceholder?: string;
  searchable?: boolean;
  multiLevel?: boolean;
  renderItem?: (info: {
    item: Entity;
    index: number;
    selectedValue?: string;
    onCloseModal: () => void;
    onItemChange: (value: Entity, selected?: boolean) => void;
  }) => React.ReactElement | null;
}
const PickerModal = ({
  items,
  position = 'full',
  isModalVisible,
  showHeaderLeft = true,
  headerTitle,
  style,
  defaultValue,
  searchable,
  searchPlaceholder,
  onItemChange,
  onCloseModal,
  multiLevel = false,
  renderItem,
}: PickerModalProps) => {
  const isFirstRun = useRef(true);
  const {t} = useLocale('common');
  const foundItem = useMemo(
    () =>
      defaultValue
        ? items.find(item => {
            return item.id.toString() === defaultValue?.toString();
          })
        : undefined,
    [defaultValue, items],
  );

  const initialState: PickerState = {
    items,
    listItems: multiLevel
      ? items.filter(i => (i as unknown as Nestable).level === 0)
      : [...items],
    // selectedItem: foundItem,
    defaultItem: foundItem,
    isModalVisible: isModalVisible,
    path: [],
    multiLevel,
  };

  const [state, dispatch] = useImmerReducer(pickerReducer, initialState);
  const {listItems, path, searchValue} = state;

  useEffect(() => {
    // init();
    if (isFirstRun.current) {
      // if (false) {
      isFirstRun.current = false;
      return;
    }

    dispatch({
      type: 'LOAD_ITEMS',
      items,
      defaultValue,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const searchHandler = useCallback(
    (value: string) => {
      dispatch({
        type: 'SEARCH_ITEMS',
        search: value,
      });
    },
    [dispatch],
  );

  const onItemSelect = useCallback(
    (i: Entity) => {
      const nestedEntity = i as unknown as Nestable;
      if (!multiLevel || nestedEntity.level === -1) {
        onItemChange(i);
        if (!renderItem) {
          onCloseModal();
        }
      } else {
        dispatch({
          type: 'SELECT_ITEM',
          item: i,
        });
      }
    },
    [dispatch, multiLevel, onCloseModal, onItemChange, renderItem],
  );

  const renderItemHandler = useCallback(
    ({item, index}: {item: Entity; index: number}) => {
      if (renderItem) {
        return renderItem({
          item,
          index,
          onItemChange: onItemSelect,
          onCloseModal,
          selectedValue: defaultValue?.toString(),
        });
      }
      return (
        <PickerItem
          item={item}
          onChange={onItemSelect}
          selected={item.id.toString() === defaultValue?.toString()}
        />
      );
    },
    [defaultValue, onCloseModal, onItemSelect, renderItem],
  );

  const listEmptyComponent = useCallback(
    () => <NoDataFound style={styles.noData} />,
    [],
  );
  const separatorComponent = useCallback(
    () => <View style={styles.separator} />,
    [],
  );
  const getItemLayout = useCallback(
    (data, index) => ({
      length: 60,
      offset: 60 * index,
      index,
    }),
    [],
  );

  const onBackHandler = useCallback(() => {
    if (path?.length === 0) {
      onCloseModal();
    } else {
      dispatch({
        type: 'BACK',
      });
    }
  }, [dispatch, onCloseModal, path]);

  return items ? (
    <Modal
      style={styles.modal}
      useNativeDriver={true}
      isVisible={isModalVisible}
      swipeDirection={['down']}
      hideModalContentWhileAnimating={true}
      onSwipeComplete={onCloseModal}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
      propagateSwipe>
      <SafeAreaView
        style={[
          styles.modalContainer,
          style,
          position === 'bottom' ? styles.bottomModal : {},
        ]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View style={[styles.modalHeader]}>
          {showHeaderLeft && (
            <Icon
              style={styles.modalNav}
              name="chevron-left"
              color={theme.colors.grey}
              onPress={onBackHandler}
              size={35}
            />
          )}

          <Text style={styles.modalTitle}>{headerTitle}</Text>
        </View>
        {!!path && <Breadcrumb path={path} />}
        {searchable && (
          <SearchInput
            style={styles.searchInput}
            value={searchValue}
            placeholder={searchPlaceholder ?? t('picker.searchPlaceholder')}
            onChangeText={searchHandler}
          />
        )}
        <FlatList
          data={listItems}
          showsVerticalScrollIndicator={false}
          renderItem={renderItemHandler}
          keyExtractor={item => item.id}
          ListEmptyComponent={listEmptyComponent}
          ItemSeparatorComponent={separatorComponent}
          style={styles.flatList}
          contentContainerStyle={
            !!items && items.length === 0 ? styles.noData : undefined
          }
          getItemLayout={getItemLayout}
        />
      </SafeAreaView>
    </Modal>
  ) : null;
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomModal: {
    flex: 0.5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 30,
    paddingTop: 30,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalNav: {
    left: 0,
    position: 'absolute',
    marginHorizontal: -20,
  },
  modalTitle: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
    alignSelf: 'center',
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 30,
  },
  searchInput: {
    marginHorizontal: -15,
  },
  flatList: {
    flex: 1,
  },
  noData: {
    flex: 0.75,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
});

export default React.memo(PickerModal);
PickerModal.whyDidYouRender = true;
