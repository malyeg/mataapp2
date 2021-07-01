import React, {FC, useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {conditionList, ConditionType} from '../../api/itemsApi';
import useLocale from '../../hooks/useLocale';
import theme from '../../styles/theme';
import {FormProps} from '../../types/DataTypes';
import {Button} from '../core';
import {Error, Picker, TextInput} from '../form';
import PickerItem from '../form/PickerItem';

const WITH_ISSUES_ITEM = conditionList.find(i => i.id === 'usedWithIssues')!;
interface ItemConditionPickerProps extends ViewProps, FormProps {
  // placeholder?: string;
  // control: any;
}

const ItemConditionPicker: FC<ItemConditionPickerProps> = ({
  name,
  control,
  defaultValue = '',
}) => {
  const [desc, setDesc] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string>();
  const [error, setError] = useState<string>();
  const {t} = useLocale('common');

  useEffect(() => {}, []);

  const onChangeDesc = (v: string) => {
    setDesc(v);
  };
  const onPickerChange = useCallback((v: string) => {
    // setDesc(v);
    setSelectedValue(v);
  }, []);

  const renderItemHandler = useCallback(
    ({item, index, onCloseModal, onItemChange}: any) => {
      return (
        <>
          <PickerItem
            item={item}
            onChange={onItemChange}
            selected={selectedValue === item.id.toString()}
            onPress={() => {
              if (item.id.toString() !== 'usedWithIssues') {
                onCloseModal();
              }
            }}
          />
          {index === conditionList.length - 1 &&
          selectedValue === WITH_ISSUES_ITEM.id ? (
            <>
              <View style={styles.withIssuesContainer}>
                <TextInput
                  label=""
                  style={styles.withIssuesInput}
                  name="usedWithIssuesDesc"
                  placeholder={t('itemConditionPicker.withIssuesDesc')}
                  onChangeText={onChangeDesc}
                  control={control}
                />
                {!!error && (
                  <Error
                    style={styles.error}
                    error={{type: 'required', message: error}}
                  />
                )}
                <Button
                  title={t('itemConditionPicker.submit')}
                  onPress={() => {
                    if (desc) {
                      setError(undefined);
                      onItemChange(WITH_ISSUES_ITEM);
                      onCloseModal();
                    } else {
                      setError(t('itemConditionPicker.descError'));
                    }
                  }}
                />
              </View>
            </>
          ) : null}
        </>
      );
    },
    [control, desc, error, selectedValue, t],
  );

  return (
    <Picker
      control={control}
      modalStyle={styles.modal}
      name={name}
      items={conditionList}
      defaultValue={defaultValue}
      placeholder={t('itemConditionPicker.placeholder')}
      modalTitle={t('itemConditionPicker.modalTitle')}
      onChange={onPickerChange}
      onSelectClose={false}
      renderItem={renderItemHandler}
      // onChange={onChange}
    />
  );
};

export default React.memo(ItemConditionPicker);

const styles = StyleSheet.create({
  modal: {
    // flex: 0.6,
    // borderTopStartRadius: 50,
    // borderTopEndRadius: 50,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.lightGrey,
  },
  withIssues: {
    borderBottomWidth: 0,
  },
  withIssuesInput: {
    marginBottom: 20,
  },
  withIssuesContainer: {
    marginTop: -20,
  },
  error: {
    marginTop: -10,
    marginBottom: 10,
  },
});
