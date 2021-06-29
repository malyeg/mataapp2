import analytics, {firebase} from '@react-native-firebase/analytics';
import {ICartItem} from '../api/card-model';
import constants from '../config/constants';
import {User} from '../contexts/user-model';
import {LoggerFactory} from './logger';

export interface AnalyticsEvent {
  name: string;
  params?: {
    [key: string]: any;
  };
}
class Analytics {
  static logger = LoggerFactory.getLogger('Analytics');
  static init() {
    if (firebase.app().utils().isRunningInTestLab) {
      analytics().setAnalyticsCollectionEnabled(false);
    } else {
      analytics().setAnalyticsCollectionEnabled(true);
    }
  }

  static logLogin = (method: string) => {
    return analytics().logLogin({method});
  };

  static setUser = (user: User) => {
    return Promise.all([
      analytics().setUserId(user.id),
      analytics().setUserProperty('email', user.email),
    ]);
  };

  static logSignUp = (method: string, user: User) => {
    return Promise.all([
      Analytics.setUser(user),
      analytics().logSignUp({method}),
    ]);
  };

  static logForgotPassword = (email: string) => {
    return analytics().logEvent('forgotPassword', {
      email,
    });
  };

  static logEvent = (eventName: string, propertyObject = {}) => {
    return analytics().logEvent(eventName, propertyObject);
  };

  static logSignOut = () => {
    return Promise.all([
      analytics().logEvent('logout'),
      analytics().resetAnalyticsData(),
    ]);
  };

  static logAddToCart = async ({
    value,
    items,
  }: {
    value: number;
    items: ICartItem[];
  }) => {
    const cartItems = items.map(item => {
      return {
        item_id: item.id,
        item_brand: item.brand,
        item_name: item.name,
        item_category: item.category,
      };
    });
    await analytics().logAddToCart({
      value,
      currency: constants.cart.DEFAULT_CURRENCY,
      items: cartItems,
    });
  };

  static setAnalyticsCollectionEnabled = (enabled: boolean) => {
    return analytics().setAnalyticsCollectionEnabled(enabled);
  };

  static logScreen = (screenName: string) => {
    return analytics().logEvent('screen_' + screenName, {});
  };

  // static logShare = (screenName: string) => {
  //   return analytics().logShare('screen_' + screenName, {});
  // };

  static trackScreen = async (screenName: string) => {
    try {
      await Promise.all([
        analytics().logScreenView({
          screen_name: screenName,
          screen_class: screenName,
        }),
        Analytics.logScreen(screenName),
      ]);
    } catch (error) {
      Analytics.logger.error(error);
    }
  };
}

export default Analytics;
