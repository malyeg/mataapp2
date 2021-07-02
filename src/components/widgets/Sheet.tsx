import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import {Button, Modal} from '../core';

export interface SheetProps {
  header?: string;
  isVisible?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
  show?: () => void;
  hide?: () => void;
  children?: React.ReactNode;
}
const Sheet = (
  {header, onClose, onConfirm, onCancel, children}: SheetProps,
  ref: any,
) => {
  const {t} = useLocale('widgets');
  const [isVisible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  const closeSheet = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setVisible(false);
  }, [onClose]);
  const cancelHandler = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    setVisible(false);
  }, [onCancel]);
  const confirmHandler = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    setVisible(false);
  }, [onConfirm]);

  return (
    <Modal isVisible={isVisible} onClose={closeSheet}>
      {header && <Text style={styles.confirmLogoutTitle}>{header}</Text>}
      {children}
      <View style={styles.modalButtonContainer}>
        <Button
          title={t('sheet.cancelBtnText')}
          style={[styles.modalButton]}
          onPress={cancelHandler}
        />
        <Button
          title={t('sheet.confirmBtnText')}
          style={[styles.modalButton, styles.confirmButton]}
          textStyle={styles.confirmText}
          onPress={confirmHandler}
        />
      </View>
    </Modal>
  );
};

export default React.memo(forwardRef(Sheet));

const styles = StyleSheet.create({
  modalButtonContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 40,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.grey,
    borderWidth: 1,
  },
  confirmText: {
    color: theme.colors.dark,
  },
  confirmLogoutTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
  },
  confirmLogoutText: {
    ...theme.styles.scale.h6,
  },
});
