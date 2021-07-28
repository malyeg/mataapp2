import {
  BottomTabBarOptions,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import React, {FC} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screens} from '../../config/constants';
import theme from '../../styles/theme';
import PressableObacity from '../core/PressableObacity';
import TabBarItem from './TabBarItem';

export const ADD_ITEM_SCREEN = 'AddItemScreen';
const TabBar: FC<BottomTabBarProps<BottomTabBarOptions>> = ({...props}) => {
  const focusedOptions =
    props.descriptors[props.state.routes[props.state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  // props.
  const addItemPressHandler = () => {
    props.navigation.navigate(screens.ADD_ITEM);
  };
  return (
    // TODO replace icons from zeplin
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        <View style={styles.addItemContainer}>
          <PressableObacity
            style={styles.addItem}
            onPress={addItemPressHandler}>
            <Icon
              name="plus"
              size={24}
              style={[styles.addItemIcon, props.iconStyle]}
            />
          </PressableObacity>
        </View>
        {props.state.routes.map((route, index) => {
          const {options} = props.descriptors[route.key];
          console.log(route.name);
          return (
            <TabBarItem
              key={index}
              {...props}
              name={route.name}
              style={index > 0 && index < 3 ? styles.middleItem : {}}
              iconStyle={route.name === 'DealsTabs' ? styles.dealsIcon : {}}
              label={(route.params as any).title}
              icon={(route.params as any).icon}
              badge={options?.tabBarBadge as number}
            />
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(TabBar);

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: theme.colors.white,
  },
  itemsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        borderColor: theme.colors.lightGrey,
        borderWidth: 2,
      },
      android: {
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOpacity: 1,
        elevation: 3,
      },
    }),
    paddingHorizontal: 20,
  },
  addItemContainer: {
    // flex: 0,
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    alignItems: 'center',
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
});
