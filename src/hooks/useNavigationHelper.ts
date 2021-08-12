import {
  NavigationHelpers,
  ParamListBase,
  RouteProp,
  useLinkTo,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import NavigationHelper from '../navigation/NavigationHelper';

const useNavigationHelper = <T extends ParamListBase>() => {
  const navigation = useNavigation<NavigationHelpers<T>>();
  const route = useRoute<RouteProp<T>>();
  const linkTo = useLinkTo();
  type navigateParameters = Parameters<typeof navigation.navigate>;
  return {
    goBack: () => {
      NavigationHelper.goBack({navigation, route, linkTo});
    },
    navigate: (screen: string, params: {fromScreen: string}) => {
      if (!params.fromScreen) {
        params.fromScreen = route.name;
      }
      navigation.navigate(screen, params);
    },
  };
};

export default useNavigationHelper;
