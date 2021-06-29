import {useCallback, useState} from 'react';

const useRefresh = () => {
  const [lastRefresh, setlastRefresh] = useState(new Date());
  const onRefresh = useCallback(() => {
    console.log('refreshing');
    setlastRefresh(new Date());
  }, []);
  return {lastRefresh, onRefresh};
};

export default useRefresh;
