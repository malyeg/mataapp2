import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Screen} from '../components/core';
import Logo from '../components/core/Logo';
import NearByItems from '../components/widgets/NearByItems';
import ProfileIcon from '../components/widgets/ProfileIcon';
import useLocation from '../hooks/useLocation';

export const HOME_SCREEN = 'HomeScreen';
const HomeScreen = () => {
  // const navigation = useNavigation();
  const {location} = useLocation();
  const [lastRefresh, setlastRefresh] = useState(new Date());

  useEffect(() => {}, [location]);

  const onRefresh = useCallback(() => {
    setlastRefresh(new Date());
  }, []);

  console.log('HomeScreen render');
  return (
    <Screen
      style={styles.container}
      refreshable
      onRefresh={onRefresh}
      scrollable={true}>
      <View style={styles.header}>
        <ProfileIcon style={styles.profile} size={30} />
        <Logo size={100} />
      </View>
      {location && location.city && (
        <NearByItems
          key={lastRefresh.getTime()}
          location={location}
          // lastRefresh={lastRefresh}
        />
      )}
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    position: 'absolute',
    right: 0,
  },
});
