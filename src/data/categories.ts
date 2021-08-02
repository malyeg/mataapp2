export default [
  {
    id: 'home',
    name: 'Home',
    level: 0,
    style: {
      iconName: 'home-outline',
      bgColor: '#ff7f78',
      textColor: 'white',
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
      bgColor: '#727272',
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
  },
  {
    id: 'home appliances',
    group: 'Home',
    name: 'Home Appliances',
    parent: 'home',
    level: -1,
    path: ['home', 'home appliances'],
  },
  {
    id: 'office furnitures',
    group: 'Office',
    name: 'Office Furnitures',
    parent: 'office',
    level: -1,
    path: ['office', 'office furnitures'],
  },
  {
    id: 'office appliances',
    group: 'Office',
    name: 'Office Appliances',
    parent: 'office',
    level: -1,
    path: ['office', 'office appliances'],
  },
  {
    id: 'garden furnitures',
    group: 'Garden',
    name: 'Garden Furnitures',
    parent: 'garden',
    level: -1,
    path: ['garden', 'garden furnitures'],
  },
  {
    id: 'garden appliances',
    group: 'Garden',
    name: 'Garden Appliances',
    parent: 'garden',
    level: -1,
    path: ['garden', 'garden appliances'],
  },
  {
    id: 'garage tools long name',
    group: 'Garage',
    name: 'Garage Tools long nameeeeee eeeeeeee eeeee eeeeeeee',
    parent: 'garden',
    level: -1,
    path: ['garden', 'garage tools long name'],
  },
  {
    id: 'garage tools',
    group: 'Garage',
    name: 'Garage Tools',
    parent: 'garden',
    level: -1,
    path: ['garden', 'garage tools'],
  },
  {
    id: 'miscellaneous',
    group: 'Miscellaneous',
    name: 'Miscellaneous',
    level: -1,
  },
];
