import {yupResolver} from '@hookform/resolvers/yup';
import {useForm as useHookForm} from 'react-hook-form';
import {AnySchema} from 'yup';
import Lazy from 'yup/lib/Lazy';
import Reference from 'yup/lib/Reference';
import useValidation from './useValidation';

type ValidationObjType = Record<
  string,
  AnySchema<any, any, any> | Reference<unknown> | Lazy<any, any>
>;

function useForm<T>(validationObj?: ValidationObjType) {
  const {validationSchema} = useValidation(validationObj ?? {});
  const formMethods = useHookForm<T>({
    resolver: yupResolver(validationSchema),
  });
  return {validationSchema, ...formMethods};
}

export default useForm;
