import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import {
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import React, {useRef} from 'react';
import {Linking} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../components/core/Toaster';
import constants from '../config/constants';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import theme from '../styles/theme';
import Analytics from '../utils/Analytics';
import {LoggerFactory} from '../utils/logger';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';

const logger = LoggerFactory.getLogger('Routes');

const linking: LinkingOptions = {
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
      const url = (remoteMessage.notification as any)?.url;

      if (url) {
        // TODO show popup;
        // TODO if yes, listener(url);
        listener(url);
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
    },
  },
};

const Routes = () => {
  const navigationRef: React.RefObject<NavigationContainerRef> = useRef(null);
  const routeNameRef = useRef<string>();
  const {user} = useAuth();
  const {hideToast} = useToast();

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
    </NavigationContainer>
  );
};

export default Routes;
