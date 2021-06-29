import React, {FC} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import ModalBase from 'react-native-modal';

type ModalProps = {
  isVisible?: boolean;
  onClose?: () => void;
  postion?: 'bottom' | 'full';
  children: React.ReactNode;
};
const Modal: FC<ModalProps> = ({
  isVisible = false,
  postion = 'bottom',
  onClose,
  children,
}) => {
  return (
    <ModalBase
      style={[styles.modal]}
      useNativeDriver={true}
      isVisible={isVisible}
      swipeDirection={['down']}
      hideModalContentWhileAnimating={true}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      propagateSwipe>
      <SafeAreaView
        style={[
          styles.container,
          postion === 'bottom' ? styles.bottomStyle : styles.fullStyle,
        ]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View style={styles.body}>{children}</View>
      </SafeAreaView>
    </ModalBase>
  );
};

export default React.memo(Modal);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
  },
  fullStyle: {
    flex: 1,
  },
  bottomStyle: {
    // flex: 0.5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
});
