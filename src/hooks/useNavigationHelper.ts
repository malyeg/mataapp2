import {useLinkTo} from '@react-navigation/native';

const useNavigationHelper = () => {
  const linkTo = useLinkTo();
  return {
    linkTo: (url: string) => {
      linkTo(url.replace('mataapp://', '/'));
      //   linkTo(url);
    },
  };
};

export default useNavigationHelper;
