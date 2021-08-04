export let BASE_URL = 'https://admin.medyour.com/api';

const AuthBgImage = require('../assets/images/bg.png');

export const auth = {
  PASSWORD_PATTERN: /^(?=.*[a-z0-9A-Z@#$%^&*_.-])(?=.{6,})/,
};

export const firebase = {
  ITEM_UPLOAD_PATH: 'images/items',
  MAX_IMAGE_SIZE: 1000 * 1000,
};

export const DOMAINS = [
  'mataapp://',
  'http://*.mataup.com',
  'http://mataup.com',
  'https://*.mataup.com',
  'https://mataup.com',
];

export const maps = {
  DEFAULT_LOCATION: {
    latitude: -41.28664,
    longitude: 174.7787,
    latitudeDelta: 1,
    longitudeDelta: 1,
  },
};

export const locale = {
  DEFAULT_LANGUAGE: 'en',
  FALLBACK_LANGUAGE: 'en',
  STORAGE_NAME: 'language',
};

export const API_URI = {
  TOKEN: 'accounts/oauth/token',
  SIGNOUT: 'accounts/oauth/signout',
  PROFILE: 'accounts/profile',
  BRANCHES: '/branches',
  SERVICES: '/services',
};

export const REGEX = {
  MOBILE: /^(\+91-|\+91|0)?\d{10}$/,
  EMAIL: /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,
};

export const cart = {
  DEFAULT_CURRENCY: 'EGP',
};

export const stacks = {
  DEALS_STACK: 'DealsStack' as 'DealsStack',
  PROFILE_STACK: 'ProfileStack' as 'ProfileStack',
  ITEMS_STACK: 'ItemsStack' as 'ItemsStack',
};
export const screens = {
  SIGN_IN: 'SignInScreen' as 'SignInScreen',
  SIGN_UP: 'SignUpScreen' as 'SignUpScreen',
  FORGOT_PASSWORD: 'ForgotPasswordScreen' as 'ForgotPasswordScreen',

  HOME_TABS: 'HomeTabs' as 'HomeTabs',
  HOME: 'HomeScreen' as 'HomeScreen',

  ITEMS: 'ItemsScreen' as 'ItemsScreen',
  ITEM_DETAILS: 'ItemDetailsScreen' as 'ItemDetailsScreen',
  MY_ITEMS: 'MyItemsScreen' as 'MyItemsScreen',
  ADD_ITEM: 'AddItemScreen' as 'AddItemScreen',

  DEALS: 'DealsScreen' as 'DealsScreen',
  MY_DEALS: 'MyDealsScreen' as 'MyDealsScreen',
  DEALS_TABS: 'DealsTabs' as 'DealsTabs',
  DEAL_DETAILS: 'DealDetailsScreen' as 'DealDetailsScreen',

  NOTIFICATIONS: 'NotificationsScreen' as 'NotificationsScreen',

  PROFILE_STACK: 'ProfileStack' as 'ProfileStack',
  PROFILE: 'ProfileScreen' as 'ProfileScreen',
  EDIT_PROFILE: 'EditProfileScreen' as 'EditProfileScreen',
  CHANGE_PASSWORD: 'ChangePasswordScreen' as 'ChangePasswordScreen',
  INTERESTS: 'MyInterestsScreen' as 'MyInterestsScreen',
  INVITE_FRIEND: 'InviteFriendScreen' as 'InviteFriendScreen',

  SETTINGS: 'SettingsScreen' as 'SettingsScreen',
  FAQ: 'FAQScreen' as 'FAQScreen',
};

const constants = {
  firebase,
  maps,
  AuthBgImage,
  BASE_URL,
  locale,
  API_URI,
  REGEX,
  cart,
  auth,
  DOMAINS,
  screens,
};

export default constants;
