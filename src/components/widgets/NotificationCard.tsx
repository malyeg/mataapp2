import {format} from 'date-fns';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import notificationsApi, {Notification} from '../../api/notificationsApi';
import {patterns} from '../../config/constants';
import useNavigationHelper from '../../hooks/useNavigationHelper';
import theme from '../../styles/theme';
import {Text} from '../core';
import Card from '../core/Card';

interface NotificationCardProps {
  notification: Notification;
  style?: StyleProp<ViewStyle>;
}
const NotificationCard = ({notification, style}: NotificationCardProps) => {
  const {linkTo} = useNavigationHelper();
  const onPress = () => {
    notificationsApi.updateDelivery(notification.id);
    if (notification.data.url) {
      linkTo(notification.data.url);
    }
  };
  return (
    <Card
      style={[styles.card, style]}
      onPress={onPress}
      // icon={{
      //   name:
      //     notification.type === 'push' ? 'bell-outline' : 'email-alert-outline',
      // }}
    >
      <View>
        <Text> {notification.title}</Text>
        <Text>{notification.body}</Text>
        {!!notification.timestamp && (
          <Text style={styles.date}>
            {format(notification.timestamp, patterns.DATE_TIME)}
          </Text>
        )}
      </View>
    </Card>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  card: {
    // flexDirection: 'column',
    // marginBottom: 10,
  },
  date: {
    ...theme.styles.scale.body2,
    color: theme.colors.grey,
  },
});
