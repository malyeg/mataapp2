import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Screen} from '../components/core';
import Icon from '../components/core/Icon';
import Logo from '../components/core/Logo';
import NearByItems from '../components/widgets/NearByItems';
import ProfileIcon from '../components/widgets/ProfileIcon';
import RecommendedItems from '../components/widgets/RecommendedItems';
import TopCategories from '../components/widgets/TopCategories';
import useAuth from '../hooks/useAuth';
import useLocation from '../hooks/useLocation';
import theme from '../styles/theme';

export const HOME_SCREEN = 'HomeScreen';
const HomeScreen = () => {
  const navigation = useNavigation();
  const {profile} = useAuth();
  const {location} = useLocation();
  const [lastRefresh, setlastRefresh] = useState(new Date());

  // useEffect(() => {}, [location]);
  // useLayoutEffect(() => {
  //   navigation.dangerouslyGetParent()?.setOptions({
  //     headerShown: false,
  //   });
  // }, [navigation]);

  const onRefresh = useCallback(() => {
    setlastRefresh(new Date());
  }, []);

  const toggleDrawer = () => {
    (navigation as any).toggleDrawer();
  };

  return (
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
      {location && location.city && (
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
            // lastRefresh={lastRefresh}
            style={styles.nearByItems}
          />
        </>
      )}
      <TopCategories style={styles.categories} />
    </Screen>
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
    marginVertical: 10,
  },
});
