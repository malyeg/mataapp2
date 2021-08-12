import {LinkingOptions} from '@react-navigation/native';
import {screens, stacks} from '../config/constants';

interface LinkingParamList {}
const LinkingConfig: LinkingOptions<LinkingParamList>['config'] = {
  screens: {
    [stacks.HOME_STACK]: {
      initialRouteName: screens.HOME,
      screens: {
        [screens.HOME]: 'home',
        [screens.ITEMS]: 'items',
        [screens.PROFILE]: 'profile',
        [screens.MY_ITEMS]: 'items/myItems',
        [screens.ITEM_DETAILS]: 'items/:id',
        [screens.DEALS_TABS]: 'deals',
        [screens.DEAL_DETAILS]: 'deals/:id',
        [screens.FAQ]: 'faq',
      },
    },
  },
};

const parseUrl = (url: string) => {
  return url.replace('?id=', '/');
};
export default LinkingConfig;

export {parseUrl};
