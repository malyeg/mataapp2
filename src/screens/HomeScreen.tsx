import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Screen} from '../components/core';
import Icon from '../components/core/Icon';
import Logo from '../components/core/Logo';
import SearchInput from '../components/form/SearchInput';
import ItemsSearch from '../components/widgets/ItemsSearch';
import NearByItems from '../components/widgets/NearByItems';
import ProfileIcon from '../components/widgets/ProfileIcon';
import RecommendedItems from '../components/widgets/RecommendedItems';
import TabBar from '../components/widgets/TabBar';
import TopCategories from '../components/widgets/TopCategories';
import useAuth from '../hooks/useAuth';
import useLocation from '../hooks/useLocation';
import theme from '../styles/theme';

export const HOME_SCREEN = 'HomeScreen';
const HomeScreen = () => {
  const navigation = useNavigation();
  const {profile} = useAuth();
  const {location} = useLocation();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    console.log('profile?.targetCategories', profile?.targetCategories);
  }, [profile?.targetCategories]);

  const onRefresh = useCallback(() => {
    setLastRefresh(new Date());
  }, []);

  const toggleDrawer = () => {
    (navigation as any).toggleDrawer();
  };

  return (
    <>
      <Screen
        style={styles.container}
        refreshable
        onRefresh={onRefresh}
        scrollable={true}>
        <View style={styles.header}>
          <Icon
            name="menu"
            size={30}
            color={theme.colors.dark}
            onPress={toggleDrawer}
          />
          <Logo size={75} style={styles.logo} />
          <ProfileIcon style={styles.profile} size={30} />
        </View>
        {/* <ItemsSearch style={styles.itemsSearch} /> */}
        {!!location?.city && (
          <>
            {profile?.targetCategories && (
              <RecommendedItems
                style={styles.recommendedItems}
                location={location}
              />
            )}
            <NearByItems
              key={lastRefresh.getTime()}
              location={location}
              style={styles.nearByItems}
            />
          </>
        )}
        <TopCategories style={styles.categories} />
      </Screen>
      <TabBar />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 60,
  },
  nearByItems: {
    marginBottom: 10,
  },
  profile: {
    // position: 'absolute',
    // right: 0,
  },
  recommendedItems: {
    marginBottom: 10,
  },
  categories: {
    // position: 'absolute'
    marginVertical: 10,
    // backgroundColor: 'grey',
    marginLeft: theme.defaults.SCREEN_PADDING * -1,
  },
  tabBar: {
    position: 'absolute',
  },
  itemsSearch: {
    marginBottom: 15,
  },
});
