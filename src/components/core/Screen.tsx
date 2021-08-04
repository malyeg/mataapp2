import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {BackHandler, RefreshControl, ScrollView, View} from 'react-native';
import {SafeAreaViewProps} from 'react-native-safe-area-context';
import {screens} from '../../config/constants';
import create from '../../styles/EStyleSheet';
import theme from '../../styles/theme';

export interface ScreenProps extends SafeAreaViewProps {
  scrollable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
}

const Screen: FC<ScreenProps> = ({
  style,
  scrollable = false,
  refreshable = false,
  onRefresh,
  children,
}) => {
  const navigation = useNavigation<DrawerNavigationHelpers>();
  const route = useRoute();
  const refreshing = useState(false)[0];

  const onRefreshHandler = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  useEffect(() => {
    const backAction = () => {
      console.log('back handler');
      if (!navigation.canGoBack()) {
        console.log('back handler: no nav');
        if (route.name !== screens.HOME_TABS) {
          console.log('back handler: no nav, not home');
          navigation.navigate(screens.HOME_TABS, {
            Screen: screens.HOME,
          });
          return true;
        }
        // TODO show toaster
        // Alert.alert(t('exitModal.title'), 'Are you sure you want to Exit?', [
        //   {
        //     text: 'Cancel',
        //     onPress: () => null,
        //     style: 'cancel',
        //   },
        //   {text: 'YES', onPress: () => BackHandler.exitApp()},
        // ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation, route.name]);

  return scrollable ? (
    <ScrollView
      // keyboardShouldPersistTaps="handled"
      keyboardShouldPersistTaps="never"
      contentContainerStyle={[styles.viewContainer, style]}
      // scrollEnabled={true}
      refreshControl={
        refreshable ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshHandler}
          />
        ) : undefined
      }>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.viewContainer, style]}>{children}</View>
  );
};

const styles = create({
  viewContainer: {
    paddingHorizontal: theme.defaults.SCREEN_PADDING,
    paddingBottom: 5,
  },
});

export default React.memo(Screen);
