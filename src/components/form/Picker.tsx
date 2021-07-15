import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useLocale from '../../hooks/useLocale';
import useController from '../../hooks/userController';
import theme from '../../styles/theme';
import {Entity} from '../../types/DataTypes';
import {Text} from '../core';
import Error from './Error';
import PickerModal, {PickerModalProps} from './PickerModal';

export interface PickerProps<T extends Entity> {
  name: string;
  items: T[];
  position?: PickerModalProps['position'];
  placeholder?: string;
  modalTitle?: string;
  label?: string;
  style?: ViewStyle;
  defaultValue?: string;
  onChange?: (value: string, selected?: boolean) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  modalStyle?: ViewStyle;
  showHeaderLeft?: boolean;
  onSelectClose?: boolean;
  disabled?: boolean;
  control: any;
  renderItem?: (info: {
    item: Entity;
    index: number;
    selectedValue?: string;
    onCloseModal: () => void;
    onItemChange: (value: Entity, selected?: boolean) => void;
  }) => React.ReactElement | null;
  multiLevel?: boolean;
}

function Picker<T extends Entity>({
  name,
  items,
  placeholder,
  label,
  defaultValue,
  onChange,
  disabled = false,
  control,
  modalTitle,
  renderItem,
  multiLevel = false,
  ...props
}: PickerProps<T>) {
  const {t} = useLocale('common');
  const {field, formState} = useController({
    control,
    defaultValue: defaultValue?.toString(),
    name,
  });

  const [isModalVisible, setModalVisible] = useState(false);

  const onItemChange = useCallback(
    (item: Entity) => {
      field.onChange(item.id.toString());
      if (onChange) {
        onChange(item.id, true);
      }
    },
    [field, onChange],
  );

  const openModal = useCallback(() => {
    !disabled && setModalVisible(true);
  }, [disabled]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const selectedItem = useMemo(
    () => items.find(i => i.id.toString() === field.value),
    [field.value, items],
  );

  return (
    <Pressable onPress={openModal} style={[styles.container, props.style]}>
      <Text body3 style={styles.label}>
        {label ?? field.value ? placeholder : ''}
      </Text>
      <View
        style={[
          styles.inputContainer,
          styles.textInputBorder,
          formState.errors[name]
            ? styles.textInputBorderError
            : styles.textInputBorder,
        ]}>
        <Text
          style={[
            styles.inputText,
            selectedItem?.name ? {} : styles.placeholderText,
          ]}
          numberOfLines={1}>
          {selectedItem?.name ?? placeholder ?? t('picker.pickerPlaceholder')}
        </Text>
        <Icon
          name="chevron-down"
          size={30}
          color={theme.colors.green}
          style={styles.pickerIcon}
        />
      </View>

      {!!formState.errors[name] && <Error error={formState.errors[name]} />}

      <PickerModal
        {...props}
        headerTitle={modalTitle}
        items={items as Entity[]}
        defaultValue={selectedItem?.id}
        isModalVisible={isModalVisible}
        onItemChange={onItemChange}
        onCloseModal={closeModal}
        renderItem={renderItem}
        multiLevel={multiLevel}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 60,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    // color: theme.colors.grey,
  },
  placeholderText: {
    color: theme.colors.grey,
  },
  label: {
    // color: theme.colors.grey,
  },

  searchInput: {
    marginHorizontal: -15,
  },
  flatList: {
    flex: 1,
  },
  noData: {
    flex: 0.75,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
  textInputBorder: {
    ...theme.styles.inputBorder,
  },
  textInputBorderError: {
    borderBottomColor: theme.colors.salmon,
    borderBottomWidth: 1,
  },
  pickerIcon: {
    marginRight: -6,
  },
});

export default React.memo(Picker);
