import {useEffect, useRef} from 'react';
import {
  FieldValues,
  useController as useControllerBase,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form';

const useController = (
  options: UseControllerProps<FieldValues, any>,
  onReset?: () => void,
) => {
  const methods = useFormContext();
  const control = options.control ?? methods.control;
  const {isSubmitted, isDirty} = methods?.formState ?? control._formState;

  const controller = useControllerBase({...options, control});
  const ref = useRef<any>(0);
  useEffect(() => {
    if (!isSubmitted && !isDirty) {
      if (!ref.current || ref.current === 0) {
        ref.current = 1;
        return;
      }
      ref.current++;
    }
    if (onReset) {
      onReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return controller;
};

export default useController;
