import {useLinkTo} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {screens} from '../../config/constants';
import theme from '../../styles/theme';
import PressableOpacity from '../core/PressableOpacity';

interface HeaderNavProps {
  style: ViewStyle;
  navigation: any;
  route: any;
}
const HeaderNav = ({navigation, route, style}: HeaderNavProps) => {
  // const navigation = useNavigation<
  //   StackNavigationHelpers | DrawerNavigationHelpers
  // >();
  const linkTo = useLinkTo();
  const onPressHandler = useCallback(() => {
    console.log(route);
    if (route?.params?.fromLink) {
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
  }, [linkTo, navigation, route]);
  return (
    <PressableOpacity
      onPress={onPressHandler}
      style={[styles.container, style]}>
      <Icon name="chevron-left" color={theme.colors.grey} size={35} />
    </PressableOpacity>
  );
};

export default React.memo(HeaderNav);

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
