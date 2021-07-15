import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import React, {useMemo, useRef} from 'react';
import {Linking} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
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
import HomeStack from './HomeStack';

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
        let initUrl =
          url ??
          link?.url ??
          (message?.notification as any)?.url ??
          'mataapp://home';
        // 'mataapp://theme';
        if (initUrl.includes('?link=')) {
          initUrl = initUrl.substring(initUrl.indexOf('?link=') + 6);
          initUrl = decodeURIComponent(initUrl);
        }
        console.log('initUrl', initUrl);
        return initUrl;
      },

      subscribe(listener: (deeplink: string) => void) {
        const onReceiveURL = ({url}: {url: string}) => listener(url);
        Linking.addEventListener('url', onReceiveURL);

        const unsubscribeNotification = messaging().onNotificationOpenedApp(
          message => {
            console.log('onNotificationOpenedApp', message);
            let url = (message.data as any)?.url as string;

            if (url) {
              listener(url.includes('//') ? url : `mataapp://${url}`);
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

        const unsubscribeDynamicLink = dynamicLinks().onLink(link =>
          listener(link.url),
        );

        return () => {
          Linking.removeEventListener('url', onReceiveURL);
          unsubscribeDynamicLink();
          unsubscribeNotification();
          onMessageUnsubscribe();
        };
      },
      config: {
        screens: {
          HomeTabs: {
            screens: {
              HomeScreen: 'home',
            },
          },
          ItemDetailsScreen: 'items',
          MyItemsScreen: 'myItems',
          ThemeScreen: 'theme',
          DealDetailsScreen: 'deals/:id',
        },
      },
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

  return (
    <NavigationContainer
      theme={MyTheme}
      ref={navigationRef}
      linking={linking}
      onReady={navigationOnReadyHandler}
      onStateChange={async () => {
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
      }}>
      {user ? <HomeStack /> : <AuthStack />}
      <Toast ref={ref => Toast.setRef(ref)} config={toastConfig} />
      <Sheet ref={sheetRef} />
    </NavigationContainer>
  );
};

export default Routes;
