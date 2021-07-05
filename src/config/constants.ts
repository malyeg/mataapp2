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

export const screens = {
  ITEMS: 'ItemsScreen' as 'ItemsScreen',
  DEALS_SCREEN: 'DealsScreen' as 'DealsScreen',
  DEAL_DETAILS_SCREEN: 'DealDetailsScreen' as 'DealDetailsScreen',
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
