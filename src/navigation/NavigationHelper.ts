import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import {screens} from '../config/constants';

interface GoBackProps {
  navigation: StackNavigationHelpers;
  // route: RouteProp<ParamListBase>;
  route: any;
  linkTo?: (path: string) => void;
}

export const goBack = ({navigation, route, linkTo}: GoBackProps) => {
  if (route?.params?.fromLink && linkTo) {
    console.log('goBack fromLink', route?.params?.fromLink);
    linkTo(route?.params?.fromLink);
  } else if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate(screens.HOME);
  }
};

export default {goBack};
