import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import {Button, Modal, Text} from '../core';

export interface SheetProps {}
export interface ShowOptions {
  header: string;
  body: string;
  cancelCallback?: () => void;
  confirmCallback?: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
}
const Sheet = ({...props}: SheetProps, ref: any) => {
  const {t} = useLocale('widgets');
  const [isVisible, setVisible] = useState(false);
  const [sheetContent, setSheetContent] = useState<ShowOptions>();

  useImperativeHandle(ref, () => ({
    show(options: ShowOptions) {
      setSheetContent(options);
      setVisible(true);
    },
    hide() {
      setVisible(false);
    },
  }));

  const closeSheet = useCallback(() => {
    setVisible(false);
  }, []);

  const cancelHandler = useCallback(() => {
    if (sheetContent?.cancelCallback) {
      sheetContent?.cancelCallback();
    }
    setVisible(false);
  }, [sheetContent]);

  const confirmHandler = useCallback(() => {
    if (sheetContent?.confirmCallback) {
      sheetContent?.confirmCallback();
    }

    setVisible(false);
  }, [sheetContent]);

  return (
    <Modal isVisible={isVisible} onClose={closeSheet}>
      <Text style={styles.confirmTitle}>{sheetContent?.header}</Text>
      <Text style={styles.confirmBody}>{sheetContent?.body}</Text>
      <View style={styles.modalButtonContainer}>
        <Button
          title={sheetContent?.cancelTitle ?? t('sheet.cancelBtnText')}
          style={[styles.modalButton]}
          themeType="white"
          onPress={cancelHandler}
        />
        <Button
          title={sheetContent?.confirmTitle ?? t('sheet.confirmBtnText')}
          style={[styles.modalButton, styles.confirmButton]}
          // textStyle={styles.confirmText}
          themeType="primary"
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
  confirmTitle: {
    ...theme.styles.scale.h5,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.salmon,
  },
  confirmBody: {
    ...theme.styles.scale.h6,
  },
});
