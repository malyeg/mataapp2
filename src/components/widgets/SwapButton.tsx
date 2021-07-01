import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Swap from '../../assets/svgs/icSwap.svg';
import theme from '../../styles/theme';

interface SwapbuttonProps {
  onPress: () => void;
}
const SwapButton = ({onPress}: SwapbuttonProps) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Swap width={20} height={20} fill={theme.colors.salmon} />
      {/* <Text>Swap</Text> */}
    </Pressable>
  );
};

export default React.memo(SwapButton);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey,
    borderWidth: 2,
    width: 50,
  },
  text: {
    color: theme.colors.dark,
    fontWeight: theme.fontWeight.thin,
  },
});
