import {screens} from '../config/constants';

interface GoBackProps {
  navigation: any;
  route: any;
  linkTo?: (path: string) => void;
}
const rootStackScreens = [screens.PROFILE, screens.DEALS, screens.ITEMS];
export const goBack = ({navigation, route, linkTo}: GoBackProps) => {
  if (route?.params?.fromLink && linkTo) {
    console.log('goBack fromLink', route?.params?.fromLink);
    linkTo(route?.params?.fromLink);
  } else if (route?.params?.fromScreen) {
    console.log('goBack fromScreen', route?.params?.fromScreen);
    navigation.navigate(route?.params?.fromScreen);
  } else if (navigation.canGoBack() && !rootStackScreens.includes(route.name)) {
    console.log('canGoBack');
    navigation.goBack();
  } else {
    console.log('cannot GoBack');
    navigation.navigate(screens.HOME);
  }
};

export default {goBack};
