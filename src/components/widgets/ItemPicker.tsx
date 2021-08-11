import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ApiResponse} from '../../api/Api';
import itemsApi, {Item} from '../../api/itemsApi';
import useAuth from '../../hooks/useAuth';
import {QueryBuilder} from '../../types/DataTypes';
import {Loader, Modal} from '../core';
import DataList from './DataList';
import ItemCard from './ItemCard';

interface ItemPickerProps {
  isVisible: boolean;
  categoryId?: string;
  onClose?: () => void;
  onChange: (item: Item) => void;
  title?: string;
}
const ItemPicker = ({
  isVisible,
  categoryId,
  onChange,
  onClose,
  title,
}: ItemPickerProps) => {
  const [items, setItems] = useState<ApiResponse<Item>>();
  const {user} = useAuth();
  useEffect(() => {
    console.log('loading ItemPicker');
    const query = new QueryBuilder<Item>().filters([
      {field: 'userId', value: user.id},
    ]);
    !!categoryId && query.filter('category.id', categoryId);
    itemsApi.getAll(query.build()).then(itemResp => {
      setItems(itemResp);
    });
  }, [categoryId, user.id]);

  const renderItem = useCallback(
    ({item}) => <ItemCard item={item} style={styles.card} onPress={onChange} />,
    [onChange],
  );

  return (
    <Modal
      isVisible={isVisible}
      showHeaderNav={true}
      title={title ?? 'Select item'}
      position="full"
      onClose={onClose}>
      {items ? (
        <DataList
          data={items}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
        />
      ) : (
        // </View>
        <Loader />
      )}
    </Modal>
  );
};

export default ItemPicker;

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flexBasis: '48%',
  },
});
