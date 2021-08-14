import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import notificationsApi, {Notification} from '../../api/notificationsApi';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';
import {QueryBuilder} from '../../types/DataTypes';

const NotificationBadge = () => {
  const {user} = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    const query = new QueryBuilder<Notification>()
      .filters([
        {field: 'delivered', value: false},
        {field: 'targetUserId', value: user.id},
      ])
      .build();
    const unsubscribe = notificationsApi.onQuerySnapshot(
      snapshot => {
        console.log('NotificationBadge onQuerySnapshot');
        setNotificationCount(snapshot.data.length);
      },
      error => console.warn('drawerContent onQuerySnapshot error', error),
      query,
    );
    return unsubscribe;
  }, [user.id]);

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{notificationCount}</Text>
    </View>
  );
};

export default NotificationBadge;

const styles = StyleSheet.create({
  badge: {
    marginLeft: 10,
    marginBottom: 10,
    width: 20,
    height: 20,
    backgroundColor: theme.colors.salmon,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...theme.styles.scale.body4,
    color: theme.colors.white,
  },
});
