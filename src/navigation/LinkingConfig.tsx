import {LinkingOptions} from '@react-navigation/native';
import {screens, stacks} from '../config/constants';

interface LinkingParamList {}
const LinkingConfig: LinkingOptions<LinkingParamList>['config'] = {
  screens: {
    [screens.HOME_TABS]: {
      screens: {
        [screens.HOME]: 'home',
      },
    },
    [stacks.ITEMS_STACK]: {
      screens: {
        [screens.ITEMS]: 'items',
        [screens.MY_ITEMS]: 'items/myItems',
        [screens.ITEM_DETAILS]: 'items/:id',
      },
    },
    [screens.FAQ]: 'faq',
    [stacks.DEALS_STACK]: {
      screens: {
        [screens.DEALS_TABS]: 'deals',
        [screens.DEAL_DETAILS]: 'deals/:id',
      },
    },
  },
};

export default LinkingConfig;
