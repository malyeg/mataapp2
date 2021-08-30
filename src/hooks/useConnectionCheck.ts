import {useNetInfo} from '@react-native-community/netinfo';
import {useEffect, useRef} from 'react';
import Toast from 'react-native-toast-message';

const useConnectionCheck = () => {
  const connectionCountRef = useRef(0);
  const netInfo = useNetInfo();
  useEffect(() => {
    if (!netInfo.details) {
      return;
    }
    if (!netInfo.isInternetReachable) {
      setTimeout(() => {
        if (netInfo.isInternetReachable) {
          console.log('has connection, resetting');
          connectionCountRef.current = 0;
          // Toast.hide();
        } else {
          connectionCountRef.current = connectionCountRef.current = 0 + 1;
          Toast.show({
            type: 'error',
            // text1: `connected: ${netInfo.isConnected?.toString()}, internet: ${netInfo.isInternetReachable?.toString()}`,
            text1: 'No connection, working offline',
            autoHide: false,
          });
        }
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netInfo.isInternetReachable]);
  return {
    ...netInfo,
  };
};

export default useConnectionCheck;
