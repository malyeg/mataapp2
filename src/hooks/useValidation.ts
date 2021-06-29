import {useMemo} from 'react';
import * as yup from 'yup';
import Lazy from 'yup/lib/Lazy';
import Reference from 'yup/lib/Reference';

function useValidation<
  T extends Record<
    string,
    yup.AnySchema<any, any, any> | Reference<unknown> | Lazy<any, any>
  >,
>(schema: T) {
  // const {i18n} = useTranslation();
  const validationSchema = useMemo(() => yup.object().shape(schema), [schema]);
  return {
    validationSchema,
  };
}

export default useValidation;
