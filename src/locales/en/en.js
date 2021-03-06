export default {
  app: {
    exitModal: {
      title: 'Hold on!',
      body: 'Are you sure?',
    },
  },
  common: {
    form: {
      error: {
        email: 'Invalid email',
        required: 'Field is required',
      },
    },
    noData: {
      title: 'No result found',
      subTitle: 'We found no result , try another suggestion',
    },
    picker: {
      pickerPlaceholder: 'Select',
      searchPlaceholder: 'Search',
    },
    imagePicker: {
      imageAction: 'Image Actions',
      deleteText: 'Delete',
      markAsDefaultText: 'Mark as default',
    },
    countryPicker: {
      title: 'Select Country',
    },
    itemConditionPicker: {
      title: 'Condition',
      placeholder: 'Condition',
      modalTitle: 'Item condition',
      withIssuesDesc: 'Describe the item issue',
      descError: 'description of the issue/s is required',
      submit: 'Confirm',
    },
    tabBar: {
      homeTitle: 'Home',
      profileTitle: 'Profile',
      settingsTitle: 'Settings',
      notificationsTitle: 'Notifications',
      wishListTitle: 'Wishlist',
      myItemsTitle: 'My Items',
      dealsTitle: 'Deals',
    },
    drawer: {
      homeLabel: 'Home',
      profileLabel: 'Profile',
      editProfileLabel: 'Edit profile',
      changePasswordLabel: 'Change password',
      settingsLabel: 'Settings',
      notificationsLabel: 'Notifications',
      wishListLabel: 'Wishlist',
      itemsLabel: 'Items',
      myItemsLabel: 'My Items',
      nearByItemsLabel: 'Nearby items',
      searchItemsLabel: 'Search items',
      dealsLabel: 'Deals',
      faqLabel: 'FAQ',
      aboutUsLabel: 'About us',
      contactUsLabel: 'Contact us',
      supportUsLabel: 'Support mata',
    },
    screens: {
      profile: 'Profile',
      settings: 'Settings',
      wishlist: 'Wishlist',
      addItem: 'Add Item',
      editProfile: 'Edit profile',
      changePassword: 'Change password',
      myItems: 'My items',
      items: '{{name}} Items',
      itemDetails: 'Item details',
      deals: 'Deals',
      archivedDeals: 'Archived deals',
      incomingDeals: 'INCOMING',
      outgoingDeals: 'OUTGOING',
      dealDetails: 'Deal details',
      faq: 'FAQ',
      notifications: 'Notifications',
      supportUs: 'Support mata',
      contactUs: 'Contact us',
      aboutUs: 'About us',
      wishList: 'Wish list',
    },
    menu: {
      archivedDealsLabel: 'Archived deals',
    },
    location: {
      title: 'Select location',
      search: {
        placeholder: 'Search for location',
      },
    },
  },
  components: {
    textDescription: {
      showMoreTitle: 'Read more ...',
      showLessTitle: 'Read less ...',
    },
  },
  widgets: {
    nearByItems: {
      title: 'Items Nearby ({{city}})',
      itemsLink: 'View All',
    },
    recommendedItems: {
      title: 'Recommended for you',
      itemsLink: 'View All',
    },
    sheet: {
      header: 'Confirm',
      confirmationTitle: 'Confirm',
      confirmBtnText: 'Confirm',
      cancelBtnText: 'Cancel',
    },
    itemsFilter: {
      showResultsBtnTitle: 'Show results',
      clearBtnTitle: 'Clear',
      country: {
        placeholder: 'Country',
        modalTitle: 'Country',
      },
      state: {
        placeholder: 'State',
        modalTitle: 'State',
      },
      city: {
        placeholder: 'City',
        modalTitle: 'City',
      },
      category: {
        placeholder: 'Category',
        modalTitle: 'Category',
      },
      swapType: {
        placeholder: 'Swap type',
        modalTitle: 'Swap type',
      },
      swapCategory: {
        placeholder: 'Swap Category',
        modalTitle: 'Swap Category',
        required: 'Swap category is required',
      },
      status: {
        placeholder: 'Status',
        modalTitle: 'Status',
      },
    },
    itemDealsTab: {
      modalTitle: 'New deals',
    },
    itemPicker: {
      noDataNoCategory: 'No items found under category \n"{{categoryName}}"',
      noData: 'No items found',
    },
  },
  homeScreen: {
    title: 'Home',
    profileBtnLabel: 'Profile',
  },
  signUpScreen: {
    username: {
      placeholder: 'Email',
      required: 'Email is required',
      invalid: 'Invalid Email',
    },
    firstName: {
      placeholder: 'First name',
      required: 'First name is required',
    },
    lastName: {
      placeholder: 'Last name',
      required: 'Last name is required',
    },
    phonePrefix: {
      label: 'Phone',
      placeholder: 'Prefix',
      required: 'Prefix required',
      invalid: 'Invalid Prefix',
      pattern: 'Must be ???',
    },
    country: {
      placeholder: 'Country',
      required: 'Country is required',
    },
    state: {
      placeholder: 'State',
      required: 'State is required',
    },
    city: {
      placeholder: 'City',
      required: 'City is required',
    },
    phone: {
      label: ' ',
      placeholder: 'Phone',
      required: 'phone is required',
      invalid: 'Invalid phone number',
      pattern: 'Must be ???',
    },
    password: {
      placeholder: 'Password',
      required: 'the Password is required',
      pattern: 'Password should be at least 6 characters',
    },
    confirmPassword: {
      placeholder: 'Confirm password',
      required: 'Confirm Password is required',
      match: 'passwords must match',
    },
    forgotPasswordLink: 'Forgot Password',
    loginBtnTitle: 'Login',
    registerBtnTitle: 'Register',
    passwordLink: 'Forgot password?',
    haveAccountText: 'Already have account?',
    LoginLink: 'Login now',
  },
  signInScreen: {
    username: {
      placeholder: 'Email',
      required: 'Email is required',
      invalid: 'Invalid Email',
    },
    password: {
      placeholder: 'Password',
      required: 'the Password is required',
    },
    dontHaveAccountText: 'Don???t have an account?',
    signUpLink: 'register now',
    forgotPasswordLink: 'Forgot Password',
    loginBtnTitle: 'Login',
    passwordLink: 'Forgot password?',
  },
  forgotPasswordScreen: {
    title: 'Forgot password',
    username: {
      placeholder: 'Email',
      required: 'Email is required',
      invalid: 'Invalid Email',
    },
    forgotPasswordTitle: 'Forgot Password',
    forgotPasswordSubTitle:
      'Please enter your registered email to reset your password.',
    confirmBtnTitle: 'Confirm',
    emailSentTitle:
      'We just sent you an email, Please follow the instructions in the email to access your account.',
    emailSentSubTitle:
      'Please follow the instructions in the email to access your account.',
    haveAccountText: 'Already have account?',
    LoginLink: 'Login now',
  },
  addItemScreen: {
    title: 'Add Item',
    addItemSuccess: 'Item added successfully ????',
    name: {
      placeholder: 'Item name',
      required: 'Name is required',
      invalid: 'Invalid name',
    },
    description: {
      placeholder: 'Short description',
    },
    category: {
      placeholder: 'Category',
      required: 'Category is required',
      invalid: 'Invalid Category',
      modalTitle: 'Category',
    },
    swapType: {
      placeholder: 'Swap type',
      modalTitle: 'Swap type',
      required: 'Swap type is required',
    },
    swapCategory: {
      placeholder: 'Swap category',
      modalTitle: 'Swap category',
      required: 'Swap category is required',
    },
    status: {
      placeholder: 'Status',
      required: 'Status is required',
      invalid: 'Invalid Status',
      label: 'Status',
      online: 'Online',
      draft: 'Draft',
      saveAsDraftLabel: 'Save as draft',
    },
    images: {
      required: 'Minimum of 1 image is required',
    },
    location: {
      required: 'Item location is required',
    },
    submitBtnTitle: 'Add',
  },
  profileScreen: {
    myItemsLink: 'My Items',
    dealsLink: 'Deals',
    editProfileLink: 'Edit profile',
    changePasswordLink: 'Change password',
    myInterestsLink: 'My interests',
    inviteUserTitle: 'Invite a friend',
    wishListTitle: 'Wish list',
    logout: {
      logoutLink: 'Logout',
      confirmLogoutTitle: 'Confirm logout',
      confirmLogoutText: 'Do you really want to logout ?',
      confirmLogoutBtnTitle: 'Confirm',
      cancelBtnTitle: 'Cancel',
    },
  },
  editProfileScreen: {
    firstName: {
      placeholder: 'First Name',
      required: 'First Name is required',
    },
    lastName: {
      placeholder: 'Last Name',
      required: 'Last Name is required',
    },
    email: {
      placeholder: 'Email',
    },
    country: {
      placeholder: 'Country',
      required: 'Country is required',
    },
    state: {
      placeholder: 'State',
      required: 'State is required',
    },
    city: {
      placeholder: 'City',
      required: 'City is required',
    },
    phonePrefix: {
      label: 'Phone',
      placeholder: 'code',
      required: 'Prefix required',
      invalid: 'Invalid Prefix',
      pattern: 'Must be ???',
    },
    phone: {
      label: ' ',
      placeholder: 'Phone',
      required: 'phone is required',
      invalid: 'Invalid phone number',
      pattern: 'Must be ???',
    },
    interests: {
      placeholder: 'Interests',
      required: 'Interests is required',
    },
    marketingFlag: {
      label: 'Accepting marketing messages',
      required: 'Status is required',
      invalid: 'Invalid Status',
    },
    isPublic: {
      label: 'Allow others to see my profile',
    },
    submitBtnTitle: 'Update',
    changeSuccess: 'Profile updated successfully ????',
  },
  changePasswordScreen: {
    oldPasswordTitleText: 'Please enter your old password.',
    newPasswordTitleText: 'Please enter your new password.',
    submitBtnTitle: 'Update',
    oldPassword: {
      placeholder: 'Old password',
      required: 'Old Password is required',
      pattern: 'Password should be at least 6 characters',
    },
    newPassword: {
      placeholder: 'New password',
      required: 'New Password is required',
      pattern: 'Password should be at least 6 characters',
    },
    confirmPassword: {
      placeholder: 'Confirm new password',
      required: 'Confirm Password is required',
      match: 'Passwords must match',
      history: "Password can't be same as the old one",
    },
    submitSuccess: 'Password changed successfully ????',
  },
  dealsScreen: {
    menu: {
      archivedDealsLabel: 'Archived deals',
    },
  },
  dealDetailsScreen: {
    approveBtnTitle: 'Start deal',
    rejectBtnTitle: 'Reject deal',
    closeBtnTitle: 'Close deal',
    cancelBtnTitle: 'Cancel deal',
    chatHeader: 'Chat with "{{userName}}"',
    menu: {
      cancelLabel: 'Cancel',
    },
    cancelOfferConfirmationHeader: 'Cancel deal',
    cancelOfferConfirmationBody: 'Are you sure?',
  },
  itemDetailsScreen: {
    ownerItemsTitle: 'Owner other items',
    itemDescriptionTitle: 'Description: ',
    addressTitle: 'Location: ',
    categoryTitle: 'Category: ',
    itemConditionTitle: 'Condition: ',
    deleteConfirmationHeader: 'Confirm',
    deleteConfirmationBody:
      'Are you sure you want to delete item ({{itemName}})?',
    swapHeader: 'New Offer',
    swapCategoryBody:
      'send swap offer for item "{{source}}" with "{{destination}}"',
    swapBody: 'Confirm sending new offer for item {{item}}',
    newOfferSuccess: 'New offer sent successfully ????',
    alreadyHasDealError: 'You already has a deal for this item',
    swapTypeTitle: 'Swap type: ',
    swapCategoryTitle: 'Swap Category: ',
    statusTitle: 'Status: ',
    sendSwapButton: 'Send swap offer',
    menu: {
      shareLabel: 'Share',
      editItemLabel: 'Edit',
      deleteLabel: 'Delete',
      archivedDealsLabel: 'Archived deals',
    },
    itemPickerTitle: 'Select Item',
  },
  SupportUsScreen: {
    content: 'Support mata and buy us a coffee',
  },
  ContactUsScreen: {
    content: 'Support mata and buy us a coffee',
    subject: {
      placeholder: 'Subject',
      required: 'Subject is required',
    },
    body: {
      placeholder: 'Message',
      required: 'Message is required',
    },
    submitBtnTitle: 'Submit',
    submitSuccess: 'Your message has been sent successfully',
  },
  error: {
    ['auth/user-not-found']: 'user not found',
    ['auth/user-disabled']: 'user is disabled',
    ['auth/invalid-email']: 'Invalid email',
    ['auth/wrong-password']: 'Invalid credentials',
    ['auth/weak-password']: 'Password should be at least 6 characters',
    ['auth/email-already-in-use']: 'Email already in use',
    ['auth/missing-android-pkg-name']:
      'auth/missing-android-pkg-name An Android package name must be provided if the Android app is required to be installed.',
    ['auth/missing-continue-uri']:
      'A continue URL must be provided in the request.',
    ['auth/missing-ios-bundle-id']:
      'An iOS Bundle ID must be provided if an App Store ID is provided.',
    ['auth/invalid-continue-uri']:
      'The continue URL provided in the request is invalid.',
    ['auth/unauthorized-continue-uri']:
      'The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.',
    ['storage/imageMaxSize']: 'Max file size of {{maxSize}} reached',
    ['firestore/permission-denied']: 'Permission denied',
    ['app/noInternetConnection']: 'You are offline',
    ['app/noConnection']: 'You are offline',
    ['location/permissionDenied']: 'Permission denied',
    ['location/serviceNotAvailable']: 'Unable to retrieve location',
  },
};
