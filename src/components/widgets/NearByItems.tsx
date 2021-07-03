import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import dealsApi from '../../api/dealsApi';
import itemsApi, {Item, ItemStatus} from '../../api/itemsApi';
import {screens} from '../../config/constants';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import {ITEM_SEARCH_SCREEN} from '../../screens/ItemSearchScreen';
import theme from '../../styles/theme';
import {
  Document,
  Filter,
  Location,
  Operation,
  QueryBuilder,
} from '../../types/DataTypes';
import {Text} from '../core';
import PressableObacity from '../core/PressableObacity';
import DataList from './DataList';
import ItemCard from './ItemCard';
import NoDataFound from './NoDataFound';

const CARD_BORDER = 2;
const CARD_HEIGHT = 200;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_BORDER;

interface NearByItemsProps {
  // items: Item[];
  // city: string;
  location: Location;
  // lastRefresh?: Date;
  userId?: string;
  title?: string;
  style?: StyleProp<ViewStyle>;
  filters?: Filter<Item>[];
}
const NearByItems = ({
  location,
  userId,
  title,
  filters,
  style,
}: NearByItemsProps) => {
  const navigation = useNavigation();
  const {user} = useAuth();

  const {t} = useLocale('widgets');

  console.log('nearbyItems render');

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const listData = useMemo(
    () => async (doc: Document<Item>) => {
      try {
        let updatedFilter: Filter<Item>[];
        if (!filters) {
          updatedFilter = [
            {field: 'location.city', value: location?.city!},
            {
              field: 'status',
              value: 'online' as ItemStatus,
            },
          ];

          if (userId) {
            updatedFilter.push({field: 'userId', value: userId});
          } else {
            updatedFilter.push({
              field: 'userId',
              value: user.id,
              operation: Operation.NOT_EQUAL,
            });
          }
        } else {
          updatedFilter = [...filters];
        }

        const query = new QueryBuilder<Item>()
          .filters(updatedFilter)
          // .filter('timestamp', new Date(2021, 6, 1), Operation.GREATER_THAN)
          .after(doc)
          .limit(20)
          // .orderBy('timestamp', 'desc')
          .orderBy('userId')
          .build();

        const response = await itemsApi.getAll(query, {
          cache: {enabled: true, key: 'nearBy_' + location?.city},
        });
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    [filters, location?.city, user.id, userId],
  );

  const listEmptyComponent = (
    <NoDataFound body={'no items found in ' + location.city} icon="">
      <PressableObacity
        onPress={() => navigation.navigate(ITEM_SEARCH_SCREEN)}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 5}}>
        <Text style={styles.anotherAreaLink}>try another area</Text>
      </PressableObacity>
    </NoDataFound>
  );

  // const onSwap = useCallback():

  const renderItem = useCallback(
    ({item}) => (
      <ItemCard
        item={item as Item}
        onSwap={async () => {
          console.log('new offer');
          const deal = await dealsApi.createOffer(user.id, item);
          console.log('new offer', deal);
        }}
      />
    ),
    [user.id],
  );
  const onEndReached = (info: any, length: number) => {
    console.log('info', info, length);
    if (length > 20) {
      navigation.navigate(screens.ITEMS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title ?? t('nearByItems.title', {params: {city: location?.city!}})}
        </Text>
        {/* <Link
          body1
          textStyle={styles.title}
          onPress={() => navigtion.navigate(ITEMS_SCREEN)}>
          {t('nearByItems.itemsLink')}
        </Link> */}
      </View>
      <DataList
        loaderStyle={styles.dataListHeight}
        refreshing={false}
        onRefresh={undefined}
        horizontal
        // pageable
        itemsFunc={listData}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        itemSize={ITEM_HEIGHT}
        onEndReached={onEndReached}
      />
    </View>
  );
};

export default React.memo(NearByItems);

const styles = StyleSheet.create({
  container: {},
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  dataListHeight: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
  },
  itemsLink: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
  },
  flatList: {
    flexGrow: 0,
  },
  card: {
    borderRadius: 10,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: 150,
    height: 200,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 6,
  },
  eyeIcon: {
    paddingRight: 5,
  },
  pressableContainer: {
    flex: 3,
    marginBottom: 5,
  },
  image: {
    flex: 1,
  },
  cardCategory: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    width: '100%',
    borderTopColor: theme.colors.lightGrey,
    borderTopWidth: 2,
  },
  listActivityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  anotherAreaLink: {
    textDecorationLine: 'underline',
  },
});
