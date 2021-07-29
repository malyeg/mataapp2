import React, {useCallback} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useSocial from '../../hooks/useSocial';
import theme from '../../styles/theme';
import PressableOpacity from '../core/PressableOpacity';

interface ShareIconProps {
  message: string;
  style?: StyleProp<ViewStyle>;
}
const ShareIcon = ({message, style}: ShareIconProps) => {
  const {onShare} = useSocial();

  // const itemId = route.params?.id;

  const onPress = useCallback(() => {
    onShare(message);
  }, [message, onShare]);
  return (
    <PressableOpacity onPress={onPress} style={style}>
      <Icon name="share-variant" color={theme.colors.grey} size={25} />
    </PressableOpacity>
  );
};

export default React.memo(ShareIcon);
