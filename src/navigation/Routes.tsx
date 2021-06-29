import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import React, {useRef} from 'react';
import {Linking} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../components/core/Toaster';
import Sheet from '../components/widgets/Sheet';
import constants from '../config/constants';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
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
    const initUrl =
      url ??
      link?.url ??
      (message?.notification as any)?.url ??
      'mataapp://home';
    console.log('initUrl', initUrl);
    return initUrl;
  },

  subscribe(listener: (deeplink: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);
    Linking.addEventListener('url', onReceiveURL);

    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      message => {
        console.log('onNotificationOpenedApp', message);
        const url = (message.notification as any)?.url;

        if (url) {
          listener(url);
        }
      },
    );
    const onMessageUnsubscribe = messaging().onMessage(remoteMessage => {
      console.log('onMessage', remoteMessage);
      const url = (remoteMessage.notification as any)?.url;
      listener('mataapp://myItems');
      if (url) {
        // TODO show popup;
        // TODO if yes, listener(url);
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

  return (
    <NavigationContainer
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
