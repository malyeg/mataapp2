import {useMemo, useRef} from 'react';
import {SheetProps, ShowOptions} from '../components/widgets/Sheet';

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
