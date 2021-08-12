import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {screens} from '../config/constants';

interface GoBackProps {
  navigation:
    | StackNavigationProp<ParamListBase>
    | DrawerNavigationProp<ParamListBase>;
  // route: RouteProp<ParamListBase>;
  route: any;
  linkTo?: (path: string) => void;
}
const rootStackScreens = [screens.PROFILE, screens.DEALS_TABS, screens.ITEMS];
export const goBack = ({navigation, route, linkTo}: GoBackProps) => {
  if (route?.params?.fromLink && linkTo) {
    console.log('goBack fromLink', route?.params?.fromLink);
    linkTo(route?.params?.fromLink);
  } else if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate(screens.HOME);
  }
  // else if (route?.params?.fromScreen) {
  //   console.log('goBack fromScreen', route?.params?.fromScreen);
  //   navigation.navigate(route?.params?.fromScreen);
  // } else if (rootStackScreens.includes(route.name)) {
  //   console.log('goBack rootStackScreens, going to home');
  //   navigation.navigate(screens.HOME);
  // } else if (navigation.canGoBack() && !!navigation.getState().history) {
  //   console.log('goBack with history', navigation.getState().history);
  //   navigation.goBack();
  // } else if (navigation.getState().type === 'stack') {
  //   console.log('goBack to index 0', route.name);
  //   navigation.navigate(navigation.getState().routeNames[0]);
  // } else {
  //   console.log('cannot GoBack');
  //   navigation.navigate(screens.HOME);
  // }
};

export default {goBack};
