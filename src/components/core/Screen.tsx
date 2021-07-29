import {useNavigation, useRoute} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {
  BackHandler,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';
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
  const navigation = useNavigation();
  const route = useRoute();
  const refreshing = useState(false)[0];

  const onRefreshHandler = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (!navigation.canGoBack()) {
        if (route.name !== screens.HOME_TABS) {
          navigation.navigate(screens.HOME_TABS);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route.name]);

  return (
    <SafeAreaProvider style={styles.providerContainer}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {scrollable ? (
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
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = create({
  providerContainer: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.white,
  },
  imageContainer: {
    flex: 1,
  },
  viewContainer: {
    paddingHorizontal: theme.defaults.SCREEN_PADDING,
    paddingBottom: 5,
  },
});

export default React.memo(Screen);
