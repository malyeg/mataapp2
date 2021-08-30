import {useLinkTo, useNavigation} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';

const useNavigationHelper = () => {
  const linkTo = useLinkTo();
  const navigation = useNavigation<StackNavigationHelpers>();
  return {
    linkTo: (url: string) => {
      linkTo(url.replace('mataapp://', '/'));
      //   linkTo(url);
    },
    navigation,
  };
};

export default useNavigationHelper;
