import React, {FC, useCallback} from 'react';
import {StatusBar, StyleSheet, View, ViewStyle} from 'react-native';
import ModalBase from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import theme from '../../styles/theme';
import Icon from './Icon';
import Text from './Text';

type ModalProps = {
  isVisible?: boolean;
  onClose?: () => void;
  position?: 'bottom' | 'full';
  showHeaderNav?: boolean;
  title?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
};
const Modal: FC<ModalProps> = ({
  isVisible = false,
  position = 'bottom',
  showHeaderNav,
  title,
  onClose,
  children,
  containerStyle,
}) => {
  const onBack = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);
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
        edges={['right', 'top', 'left']}
        style={[
          styles.container,
          position === 'bottom' ? styles.bottomStyle : styles.fullStyle,
        ]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={[styles.modalHeader]}>
          {showHeaderNav && position === 'full' && (
            <Icon
              name="chevron-left"
              color={theme.colors.grey}
              size={35}
              onPress={onBack}
            />
          )}
          {!!title && (
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{title}</Text>
              {position === 'bottom' && (
                <Icon
                  name="chevron-down"
                  color={theme.colors.grey}
                  size={35}
                  style={styles.chevronDownIcon}
                  onPress={onBack}
                />
              )}
            </View>
          )}
        </View>

        <View
          style={[
            styles.body,
            position === 'full'
              ? styles.positionFull
              : !title
              ? styles.positionBottom
              : {},

            containerStyle,
          ]}>
          {children}
        </View>
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
    // paddingTop: 30,
  },
  positionFull: {
    flex: 1,
    // marginTop: 30,
  },
  positionBottom: {
    marginTop: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 30,
  },
  modalTitle: {
    ...theme.styles.scale.h6,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
    // alignSelf: 'center',
    marginVertical: 20,
  },
  chevronDownIcon: {
    color: theme.colors.salmon,
    position: 'absolute',
    right: 20,
  },
});
