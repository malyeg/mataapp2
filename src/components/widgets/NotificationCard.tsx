import {format} from 'date-fns';
import React from 'react';
import {StyleSheet} from 'react-native';
import notificationsApi, {Notification} from '../../api/notificationsApi';
import {patterns} from '../../config/constants';
import useNavigationHelper from '../../hooks/useNavigationHelper';
import theme from '../../styles/theme';
import {Text} from '../core';
import Card from '../core/Card';

interface NotificationCardProps {
  notification: Notification;
}
const NotificationCard = ({notification}: NotificationCardProps) => {
  const {linkTo} = useNavigationHelper();
  const onPress = () => {
    notificationsApi.updateDelivery(notification.id);
    if (notification.data.url) {
      linkTo(notification.data.url);
    }
  };
  return (
    <Card
      onPress={onPress}
      icon={{
        name:
          notification.type === 'push' ? 'bell-outline' : 'email-alert-outline',
      }}>
      <Text> {notification.title}</Text>
      <Text>{notification.body}</Text>
      {!!notification.timestamp && (
        <Text style={styles.date}>
          {format(notification.timestamp, patterns.DATE_TIME)}
        </Text>
      )}
    </Card>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  date: {
    ...theme.styles.scale.body2,
    color: theme.colors.grey,
  },
});
