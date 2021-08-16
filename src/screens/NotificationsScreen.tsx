import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import itemsApi from '../api/itemsApi';
import notificationsApi from '../api/notificationsApi';
import {Loader, Screen} from '../components/core';
import NoDataFound from '../components/widgets/NoDataFound';
import NotificationCard from '../components/widgets/NotificationCard';
import {useFirestoreSnapshot} from '../hooks/firebase/useFirestoreSnapshot';
import useAuth from '../hooks/useAuth';
import {QueryBuilder} from '../types/DataTypes';

const NotificationsScreen = () => {
  const {user} = useAuth();

  const {data, loading} = useFirestoreSnapshot({
    collectionName: notificationsApi.collectionName,
    query: QueryBuilder.from({
      filters: [
        {field: 'delivered', value: true},
        {field: 'targetUserId', value: user.id},
      ],
    }),
  });

  const renderItem = ({item}: any) => <NotificationCard notification={item} />;

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

export default NotificationsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
