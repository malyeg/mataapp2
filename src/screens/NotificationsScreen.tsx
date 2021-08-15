import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ApiResponse} from '../api/Api';
import notificationsApi, {Notification} from '../api/notificationsApi';
import {Loader, Screen} from '../components/core';
import DataList from '../components/widgets/DataList';
import NotificationCard from '../components/widgets/NotificationCard';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import {QueryBuilder} from '../types/DataTypes';

const NotificationsScreen = () => {
  const [notifications, setNotifications] =
    useState<ApiResponse<Notification>>();
  const {loader} = useApi();
  const {user} = useAuth();

  useEffect(() => {
    const query = new QueryBuilder<Notification>()
      .filters([
        {field: 'delivered', value: false},
        {field: 'targetUserId', value: user.id},
      ])
      .build();
    const unsubscribe = notificationsApi.onQuerySnapshot(
      snapshot => {
        console.log('query:', query, snapshot.data.length);
        setNotifications({items: snapshot.data ?? []});
      },
      error => {
        console.error(error);
      },
      query,
    );

    return unsubscribe;
  }, [user.id]);

  const renderItem = ({item}: any) => <NotificationCard notification={item} />;

  return (
    <Screen style={styles.screen}>
      {notifications ? (
        <DataList
          showsVerticalScrollIndicator={false}
          data={notifications}
          // columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
          // itemSize={ITEM_CARD_HEIGHT}
        />
      ) : (
        <Loader />
      )}
      {loader}
    </Screen>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
