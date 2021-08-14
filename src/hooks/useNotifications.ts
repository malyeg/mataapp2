import {useEffect, useMemo, useState} from 'react';
import notificationsApi, {Notification} from '../api/notificationsApi';
import {QueryBuilder} from '../types/DataTypes';
import useAuth from './useAuth';

const useNotifications = () => {
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
        console.log('useNotifications onQuerySnapshot');
        setNotificationCount(snapshot.data.length);
      },
      error => console.warn('drawerContent onQuerySnapshot error', error),
      query,
    );
    return unsubscribe;
  }, [user.id]);
  const context = useMemo(
    () => ({
      getNotificationsCount: () => {
        return notificationCount;
      },
    }),
    [notificationCount],
  );

  return context;
};

export default useNotifications;
