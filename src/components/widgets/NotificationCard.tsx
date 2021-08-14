import {format} from 'date-fns';
import React from 'react';
import {StyleSheet} from 'react-native';
import notificationsApi, {Notification} from '../../api/notificationsApi';
import {patterns} from '../../config/constants';
import useNavigationHelper from '../../hooks/useNavigationHelper';
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
      <Text>
        {notification.timestamp &&
          format(notification.timestamp, patterns.DATE_TIME)}
      </Text>
      <Text> {notification.title}</Text>
      <Text>{notification.body}</Text>
      <Text>delivered: {notification.delivered ? 'true' : 'false'}</Text>
    </Card>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({});
