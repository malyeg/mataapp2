import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screens, stacks} from '../../config/constants';
import theme from '../../styles/theme';
import PressableOpacity from '../core/PressableOpacity';
import TabBarItem from './TabBarItem';

export const ADD_ITEM_SCREEN = 'AddItemScreen';
interface TabBarProps extends BottomTabBarProps {}
const TabBar = ({...props}: TabBarProps) => {
  const addItemPressHandler = () => {
    props.navigation.navigate(screens.ADD_ITEM);
  };
  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        <View style={styles.addItemContainer}>
          <PressableOpacity
            style={styles.addItem}
            onPress={addItemPressHandler}>
            <Icon name="plus" size={24} style={[styles.addItemIcon]} />
          </PressableOpacity>
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
              label={(route.params as any)?.title}
              icon={(route.params as any)?.icon}
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
    height: 75,
    backgroundColor: theme.colors.white,
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
