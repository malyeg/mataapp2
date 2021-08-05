import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screens, stacks} from '../../config/constants';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import PressableOpacity from '../core/PressableOpacity';
import TabBarItem from './TabBarItem';

export const ADD_ITEM_SCREEN = 'AddItemScreen';
interface TabBarProps {
  // position: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
}
const TabBar = ({style}: TabBarProps) => {
  const {t} = useLocale('common');
  const navigation = useNavigation<DrawerNavigationHelpers>();
  const route = useRoute();

  const addItemPressHandler = () => {
    navigation.navigate(screens.ADD_ITEM);
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.itemsContainer}>
        <View style={styles.addItemContainer}>
          <PressableOpacity
            style={styles.addItem}
            onPress={addItemPressHandler}>
            <Icon name="plus" size={24} style={[styles.addItemIcon]} />
          </PressableOpacity>
        </View>

        <TabBarItem
          label={t('tabBar.homeTitle')}
          icon="home-outline"
          isFocused={route.name === screens.HOME}
          onPress={() => navigation.navigate(screens.HOME)}
        />
        <TabBarItem
          label={t('tabBar.notificationsTitle')}
          icon="bell-outline"
          style={styles.middleItem}
          isFocused={route.name === screens.NOTIFICATIONS}
          onPress={() => navigation.navigate(screens.NOTIFICATIONS)}
        />

        <TabBarItem
          label={t('tabBar.myItemsTitle')}
          icon="view-list-outline"
          style={styles.middleItem}
          isFocused={route.name === screens.MY_ITEMS}
          onPress={() =>
            navigation.navigate(stacks.ITEMS_STACK, {
              screen: screens.MY_ITEMS,
            })
          }
        />
        <TabBarItem
          label={t('tabBar.dealsTitle')}
          icon="handshake"
          iconStyle={styles.dealsIcon}
          isFocused={route.name === screens.DEALS_TABS}
          onPress={() => navigation.navigate(stacks.DEALS_STACK)}
        />
      </View>
    </View>
  );
};

export default React.memo(TabBar);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 75,
    // backgroundColor: theme.colors.white,
    zIndex: 10000,
  },
  itemsContainer: {
    flex: 1,
    marginTop: 10,
    // height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        borderColor: theme.colors.lightGrey,
        borderWidth: 2,
        paddingBottom: 10,
      },
      android: {
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOpacity: 1,
        elevation: 3,
        paddingBottom: 5,
      },
    }),
    paddingHorizontal: 20,
  },
  addItemContainer: {
    // flex: 0,
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: -10,
  },
  addItem: {
    backgroundColor: theme.colors.salmon,
    height: 52,
    width: 52,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemIcon: {
    color: theme.colors.white,
  },
  middleItem: {
    marginHorizontal: 40,
    // backgroundColor: 'grey',
  },
  dealsIcon: {
    transform: [{rotate: '40deg'}],
  },
  iconStyle: {},
});
