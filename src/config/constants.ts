export let BASE_URL = 'https://admin.medyour.com/api';
let SHARE_DOMAIN = 'https://mataapp.page.link/home';

const AuthBgImage = require('../assets/images/bg.png');

export const auth = {
  PASSWORD_PATTERN: /^(?=.*[a-z0-9A-Z@#$%^&*_.-])(?=.{6,})/,
};

export const firebase = {
  REGION: 'australia-southeast1',
  ITEM_UPLOAD_PATH: 'images/items',
  MAX_IMAGE_SIZE: 1000 * 1000,
  MAX_QUERY_LIMIT: 100,
  TEMP_IMAGE_URL:
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.smartdatajob.com%2Findex.php%2Fen%2F&psig=AOvVaw1MzxSql0s6MvMQQsPKug7q&ust=1628587135925000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCKCbv_PQo_ICFQAAAAAdAAAAABAD',
};

export const patterns = {
  DATE: 'MMMM do, yyyy',
  DATE_TIME: 'MMMM do, yyyy HH:MM',
};

export const payment = {
  SUPPORT_US_URL: 'https://www.buymeacoffee.com/MataApp',
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
  HOME_STACK: 'HomeStack' as 'HomeStack',
};
export const screens = {
  SIGN_IN: 'SignInScreen' as 'SignInScreen',
  SIGN_UP: 'SignUpScreen' as 'SignUpScreen',
  FORGOT_PASSWORD: 'ForgotPasswordScreen' as 'ForgotPasswordScreen',
  HOME: 'HomeScreen' as 'HomeScreen',

  ITEMS: 'ItemsScreen' as 'ItemsScreen',
  ITEM_DETAILS: 'ItemDetailsScreen' as 'ItemDetailsScreen',
  MY_ITEMS: 'MyItemsScreen' as 'MyItemsScreen',
  ADD_ITEM: 'AddItemScreen' as 'AddItemScreen',
  EDIT_ITEM: 'AddItemScreen' as 'AddItemScreen',

  DEALS: 'DealsScreen' as 'DealsScreen',
  MY_DEALS: 'MyDealsScreen' as 'MyDealsScreen',
  DEALS_TABS: 'DealsTabs' as 'DealsTabs',
  ARCHIVED_DEALS_TABS: 'ArchivedDealsTabs' as 'ArchivedDealsTabs',
  OUTGOING_DEALS: 'OutgoingDealsScreen' as 'OutgoingDealsScreen',
  INCOMING_DEALS: 'IncomingDealsScreen' as 'IncomingDealsScreen',
  DEAL_DETAILS: 'DealDetailsScreen' as 'DealDetailsScreen',

  NOTIFICATIONS: 'NotificationsScreen' as 'NotificationsScreen',

  PROFILE: 'ProfileScreen' as 'ProfileScreen',
  EDIT_PROFILE: 'EditProfileScreen' as 'EditProfileScreen',
  CHANGE_PASSWORD: 'ChangePasswordScreen' as 'ChangePasswordScreen',
  INTERESTS: 'MyInterestsScreen' as 'MyInterestsScreen',
  INVITE_FRIEND: 'InviteFriendScreen' as 'InviteFriendScreen',
  WISH_LIST: 'WishListScreen' as 'WishListScreen',

  SETTINGS: 'SettingsScreen' as 'SettingsScreen',
  FAQ: 'FAQScreen' as 'FAQScreen',
  SUPPORT_US: 'SupportUsScreen' as 'SupportUsScreen',
  CONTACT_US: 'ContactUsScreen' as 'ContactUsScreen',
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
  payment,
  stacks,
  patterns,
  SHARE_DOMAIN,
};

export default constants;
