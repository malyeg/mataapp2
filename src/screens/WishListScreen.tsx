import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import listsApi from '../api/listsApi';
import {Loader, Screen} from '../components/core';
import NoDataFound from '../components/widgets/NoDataFound';
import WishCard from '../components/widgets/WishCard';
import {useFirestoreSnapshot} from '../hooks/firebase/useFirestoreSnapshot';
import useAuth from '../hooks/useAuth';
import {QueryBuilder} from '../types/DataTypes';

const WishListScreen = () => {
  const {user} = useAuth();

  const {data, loading} = useFirestoreSnapshot({
    collectionName: listsApi.collectionName,
    query: QueryBuilder.from({
      filters: [{field: 'userId', value: user.id}],
    }),
  });

  const renderItem = ({item}: any) => (
    <WishCard listItem={item} style={styles.card} />
    // <RecommendedCard item={item.item} />
  );

  return (
    <Screen style={styles.screen}>
      {!loading ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          ListEmptyComponent={NoDataFound}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Loader />
      )}
    </Screen>
  );
};

export default WishListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
  },
});
