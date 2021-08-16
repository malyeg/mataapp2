import theme from '../styles/theme';

export default [
  {
    id: 'home',
    name: 'Home',
    level: 0,
    style: {
      iconName: 'home-outline',
      bgColor: theme.colors.salmon,
      textColor: theme.colors.white,
    },
  },
  {
    id: 'office',
    name: 'Office',
    level: 0,
    style: {
      iconName: 'office-building',
      bgColor: '#83D2C8',
      textColor: 'white',
    },
  },
  {
    id: 'garden',
    name: 'Garden',
    level: 0,
    style: {
      iconName: 'shovel',
      bgColor: theme.colors.dark,
      textColor: 'white',
    },
  },
  {
    id: 'books',
    name: 'Books',
    level: 0,
    style: {
      iconName: 'bookshelf',
      bgColor: 'brown',
      textColor: 'white',
    },
  },
  {
    id: 'home furnitures',
    group: 'Home',
    name: 'Home Furnitures',
    parent: 'home',
    level: -1,
    path: ['home', 'home furniture'],
    style: {
      iconName: 'home-outline',
    },
  },
  {
    id: 'home appliances',
    group: 'Home',
    name: 'Home Appliances',
    parent: 'home',
    level: -1,
    path: ['home', 'home appliances'],
    style: {
      iconName: 'home-outline',
    },
  },
  {
    id: 'office furnitures',
    group: 'Office',
    name: 'Office Furnitures',
    parent: 'office',
    level: -1,
    path: ['office', 'office furnitures'],
    style: {
      iconName: 'office-building',
    },
  },
  {
    id: 'office appliances',
    group: 'Office',
    name: 'Office Appliances',
    parent: 'office',
    level: -1,
    path: ['office', 'office appliances'],
    style: {
      iconName: 'office-building',
    },
  },
  {
    id: 'garden furnitures',
    group: 'Garden',
    name: 'Garden Furnitures',
    parent: 'garden',
    level: -1,
    path: ['garden', 'garden furnitures'],
    style: {
      iconName: 'shovel',
    },
  },
  {
    id: 'garden appliances',
    group: 'Garden',
    name: 'Garden Appliances',
    parent: 'garden',
    level: -1,
    path: ['garden', 'garden appliances'],
    style: {
      iconName: 'shovel',
    },
  },
  {
    id: 'garage tools',
    group: 'Garage',
    name: 'Garage Tools',
    parent: 'garden',
    level: -1,
    path: ['garden', 'garage tools'],
    style: {
      iconName: 'shovel',
    },
  },
  {
    id: 'miscellaneous',
    group: 'Miscellaneous',
    name: 'Miscellaneous',
    level: -1,
  },
];
