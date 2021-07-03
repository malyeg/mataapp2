import React, {useCallback, useMemo, useState} from 'react';
import {useRef} from 'react';
import Sheet, {SheetProps} from '../components/widgets/Sheet';

interface UseSheetProps {
  isVisible?: boolean;
}
const useSheet = (opts: UseSheetProps = {}) => {
  const sheetRef = useRef<SheetProps>();

  //   const closeHandler = useCallback(() => {
  //     sheetRef.current.hide();
  //   }, []);
  //   const showHandler = useCallback(() => {
  //     sheetRef.current!.hide();
  //   }, []);

  const context = useMemo(
    () => ({
      show: () => {
        sheetRef?.current!.show();
      },
      hide: () => sheetRef.current!.hide(),
    }),
    [],
  );

  return {...context, sheetRef};
};

export default useSheet;
