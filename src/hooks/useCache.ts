import {useEffect} from 'react';
import cache from '../utils/cache/cacheManager';

let interval: NodeJS.Timeout;
const useCache = (cleanupIntervalInSeconds: number = 60) => {
  //   const [time, setTime] = useState(Date.now());

  useEffect(() => {
    if (interval) {
      return;
    }
    interval = setInterval(() => {
      //   cleanup cache
    }, cleanupIntervalInSeconds * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [cleanupIntervalInSeconds]);

  return {
    store: cache.store,
    addToRegistry: cache.addToRegistry,
    clear: cache.clear,
    get: cache.get,
    remove: cache.remove,
  };
};

export default useCache;
