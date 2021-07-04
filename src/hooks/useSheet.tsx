import React, {useCallback, useMemo, useState} from 'react';
import {useRef} from 'react';
import Sheet, {SheetProps, ShowOptions} from '../components/widgets/Sheet';

interface UseSheetProps {
  isVisible?: boolean;
}
const useSheet = () => {
  const sheetRef = useRef<SheetProps>();

  const context = useMemo(
    () => ({
      show: (options: ShowOptions) => {
        sheetRef?.current!.show(options);
      },
      hide: () => sheetRef.current!.hide(),
    }),
    [],
  );

  return {...context, sheetRef};
};

export default useSheet;
