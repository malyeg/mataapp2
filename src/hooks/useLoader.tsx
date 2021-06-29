import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Loader} from '../components/core';

// interface UserLoaderProps {
//   initValue?: boolean;
// }
const useLoader = (initValue = false) => {
  const [loading, setLoading] = useState(initValue);

  const loader = loading ? <Loader /> : null;

  return {
    loader,
    loading,
    showLoader: () => setLoading(true),
    hideLoader: () => setLoading(false),
  };
};

export default useLoader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    elevation: 10,
    width: '100%',
    height: '100%',
    top: 0,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
