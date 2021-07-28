import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from '../components/core/Icon';
import ProfileHeader from '../components/widgets/ProfileHeader';
import theme from '../styles/theme';

const DrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  return (
    <DrawerContentScrollView {...props}>
      <ProfileHeader style={styles.header} userNameStyle={styles.profileName} />
      <DrawerItemList
        {...props}
        labelStyle={styles.itemText}
        itemStyle={styles.drawerItem}
        activeBackgroundColor={theme.colors.white}
      />

      {/* <DrawerItem
        label="FAQ"
        // icon={({size, color}) => (
        //   <Icon
        //     name="help"
        //     size={size}
        //     color={color ?? theme.colors.white}
        //     style={styles.icon}
        //   />
        // )}
        onPress={() => console.log('help link')}
        style={styles.drawerItem}
        labelStyle={styles.itemText}
      /> */}
    </DrawerContentScrollView>
  );
};

export default React.memo(DrawerContent);

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  profileName: {
    ...theme.styles.scale.h6,
  },
  drawerItem: {
    borderBottomColor: theme.colors.lightGrey,
    borderBottomWidth: 2,
  },
  itemText: {
    color: theme.colors.dark,
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.semiBold,
    // marginLeft: -30,
  },
  icon: {
    // backgroundColor: 'grey',
  },
});
