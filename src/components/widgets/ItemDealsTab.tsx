import {useNavigation} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, Pressable, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ApiResponse} from '../../api/Api';
import dealsApi, {Deal} from '../../api/dealsApi';
import {Item} from '../../api/itemsApi';
import {screens, stacks} from '../../config/constants';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';
import {Operation, QueryBuilder} from '../../types/DataTypes';
import {Icon, Modal, Text} from '../core';
import DataList from './DataList';
import DealCard from './DealCard';

interface ItemDealsTabProps {
  item: Item;
  style?: StyleProp<ViewStyle>;
}
const ItemDealsTab = ({item, style}: ItemDealsTabProps) => {
  const [isVisible, setVisible] = useState(false);
  const navigation = useNavigation<StackNavigationHelpers>();
  const [deals, setDeals] = useState<ApiResponse<Deal> | undefined>();
  const insets = useSafeAreaInsets();
  const {user} = useAuth();

  useEffect(() => {
    const query = new QueryBuilder<Deal>()
      .filters([
        {field: 'item.id', value: item.id},
        {field: 'status', operation: Operation.IN, value: ['new', 'accepted']},
      ])
      .build();
    dealsApi.getAll(query).then(dealList => {
      if (!!dealList && dealList.items.length > 0) {
        setDeals(dealList);
      }
    });
  }, [item, user.id]);

  const renderItem = useCallback(
    ({item}) => (
      <DealCard
        deal={item}
        style={styles.card}
        imageStyle={styles.cardImage}
        onPress={() => {
          setVisible(false);
          navigation.navigate(stacks.DEALS_STACK, {
            screen: screens.DEAL_DETAILS,
            params: {id: item.id, fromScreen: screens.ITEM_DETAILS},
          });
        }}
      />
    ),
    [navigation],
  );
  return deals ? (
    <>
      <View
        style={
          (styles.container,
          {bottom: insets.bottom * -1, paddingBottom: insets.bottom})
        }>
        <Pressable
          onPress={() => setVisible(true)}
          style={[styles.tabContainer, style]}>
          <View style={styles.dealsCountContainer}>
            <Text style={styles.dealsCountText}>{deals.items.length}</Text>
          </View>
          <Text style={styles.tabText}>You have deals on your item</Text>
          <Icon
            name="chevron-up"
            size={30}
            color={theme.colors.salmon}
            style={styles.chevronIcon}
          />
        </Pressable>
      </View>
      <Modal
        position={deals.items.length > 4 ? 'full' : 'bottom'}
        isVisible={isVisible}
        containerStyle={styles.modal}
        showHeaderNav={true}
        title="Item Deals"
        onClose={() => setVisible(false)}>
        <DataList
          data={deals}
          renderItem={renderItem}
          containerStyle={styles.dataList}
        />
      </Modal>
    </>
  ) : null;
};

export default ItemDealsTab;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    backgroundColor: theme.colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    ...Platform.select({
      ios: {
        // shadowRadius: 1,
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1,
        borderColor: theme.colors.lightGrey,
        borderWidth: 2,
        borderBottomWidth: 0,
        paddingBottom: 10,
        // borderBottomWith: 0,
        // borderBottomColor: theme.colors.white,
      },
      android: {
        elevation: 2,
      },
    }),
    padding: 20,
  },
  chevronIcon: {
    position: 'absolute',
    right: 20,
  },
  modal: {
    // justifyContent: 'flex-start',
    // marginTop: 20,
    // flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // marginTop: 20,
  },
  modalBody: {},
  card: {
    marginBottom: 20,
  },
  cardImage: {
    width: 50,
    height: 50,
  },
  viewMoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dataList: {},
  tabText: {
    color: theme.colors.salmon,
  },
  dealsCountContainer: {
    position: 'absolute',
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.salmon,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  dealsCountText: {
    color: theme.colors.white,
  },
});
