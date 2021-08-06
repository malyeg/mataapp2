import {screens} from '../config/constants';

interface GoBackProps {
  navigation: any;
  route: any;
  linkTo?: (path: string) => void;
}
export const goBack = ({navigation, route, linkTo}: GoBackProps) => {
  if (route?.params?.fromLink && linkTo) {
    console.log('goBack fromLink', route?.params?.fromLink);
    linkTo(route?.params?.fromLink);
  } else if (route?.params?.fromScreen) {
    console.log('goBack fromScreen', route?.params?.fromScreen);
    navigation.navigate(route?.params?.fromScreen);
  } else if (navigation.canGoBack() && navigation.getState().history) {
    console.log('canGoBack', navigation.getState().history);
    navigation.goBack();
  } else {
    console.log('cannot GoBack');
    navigation.navigate(screens.HOME);
  }
};

export default {goBack};
