import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import React, {useMemo, useRef} from 'react';
import {MenuProvider} from 'react-native-popup-menu';
import {Linking, StyleSheet} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import notificationsApi from '../api/notificationsApi';
import {toastConfig} from '../components/core/Toaster';
import Sheet from '../components/widgets/Sheet';
import constants from '../config/constants';
import useAuth from '../hooks/useAuth';
import useSheet from '../hooks/useSheet';
import useToast from '../hooks/useToast';
import theme from '../styles/theme';
import Analytics from '../utils/Analytics';
import {LoggerFactory} from '../utils/logger';
import AuthStack from './AuthStack';
import DrawerStack from './DrawerStack';
import LinkingConfig, {parseUrl} from './LinkingConfig';

const logger = LoggerFactory.getLogger('Routes');

const Routes = () => {
  const navigationRef: React.RefObject<NavigationContainerRef> = useRef(null);
  const routeNameRef = useRef<string>();
  const {user} = useAuth();
  const {hideToast} = useToast();
  const {show, sheetRef} = useSheet();

  const linking: LinkingOptions = useMemo(
    () => ({
      prefixes: constants.DOMAINS,
      async getInitialURL(): Promise<string | null> {
        // Check if the app was opened by a deep link
        const url = await Linking.getInitialURL();
        const link = await dynamicLinks().getInitialLink();
        const message = await messaging().getInitialNotification();
        console.log('getInitialURL', {url, link, message});
        let initUrl: string =
          url ?? link?.url ?? (message?.data as any)?.url ?? 'mataapp://home';
        // 'mataapp://theme';
        if (initUrl.includes('?link=')) {
          initUrl = initUrl.substring(initUrl.indexOf('?link=') + 6);
          initUrl = decodeURIComponent(initUrl);
        }
        if (initUrl.includes('?id=')) {
          initUrl = parseUrl(initUrl);
        }
        console.log('initUrl', initUrl);
        return initUrl;
      },

      subscribe(listener: (deeplink: string) => void) {
        console.log('subscribe');
        const onReceiveURL = ({url}: {url: string}) => {
          console.log('subscribe', url);
          listener(url);
        };
        Linking.addEventListener('url', onReceiveURL);

        const unsubscribeNotification = messaging().onNotificationOpenedApp(
          message => {
            console.log('onNotificationOpenedApp', message);
            let url = (message.data as any)?.url as string;
            const id = (message.data as any)?.id as string;
            if (id) {
              notificationsApi.updateDelivery(id);
            }

            if (url) {
              const fullUrl = url.includes('//') ? url : `mataapp://${url}`;
              console.log('onNotificationOpenedApp url', fullUrl);
              listener(fullUrl);
            } else {
              console.log('onNotificationOpenedApp no url');
            }
          },
        );

        const onMessageUnsubscribe = messaging().onMessage(remoteMessage => {
          console.log('onMessage', remoteMessage);
          const url =
            (remoteMessage.notification as any)?.url ??
            (remoteMessage as any)?.data?.url;

          if (url) {
            show({
              header: remoteMessage.notification?.title ?? 'Confirm',
              body: remoteMessage.notification?.body ?? '',
              cancelCallback: () => console.log('canceling'),
              confirmCallback: () => listener(url),
              confirmTitle: 'Open',
            });
            // listener(url);
          } else {
            console.log('onMessage, no url');
          }
        });

        const unsubscribeDynamicLink = dynamicLinks().onLink(link => {
          console.log('dynamicLinks', link);
          const url = parseUrl(link.url);
          listener(url);
        });

        return () => {
          Linking.removeEventListener('url', onReceiveURL);
          unsubscribeDynamicLink();
          unsubscribeNotification();
          onMessageUnsubscribe();
        };
      },
      config: LinkingConfig,
    }),
    [show],
  );

  const navigationOnReadyHandler = () => {
    routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
    RNBootSplash.hide({fade: true});
  };

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.white,
    },
  };

  const onStateChange = async () => {
    try {
      const route = navigationRef?.current?.getCurrentRoute()!;
      const previousRouteName = routeNameRef.current;
      const currentRouteName = route.name;
      const currentRouteParams = route.params;
      hideToast();
      if (previousRouteName !== currentRouteName) {
        logger.trace(
          'changing route from to:',
          previousRouteName,
          currentRouteName,
          currentRouteParams,
        );
        Analytics.trackScreen(currentRouteName);
      } else {
        logger.trace("route didn't change");
      }
      routeNameRef.current = currentRouteName;
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <NavigationContainer
      theme={MyTheme}
      ref={navigationRef}
      linking={linking}
      onReady={navigationOnReadyHandler}
      onStateChange={onStateChange}>
      <SafeAreaView
        style={styles.safeAreaContainer}
        // edges={['left', 'right', 'top']}
      >
        <MenuProvider>{user ? <DrawerStack /> : <AuthStack />}</MenuProvider>
      </SafeAreaView>
      <Toast ref={ref => Toast.setRef(ref)} config={toastConfig} />
      <Sheet ref={sheetRef} />
    </NavigationContainer>
  );
};

export default Routes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.white,
  },
});
