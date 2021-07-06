import AsyncStorage from '@react-native-async-storage/async-storage';
import {differenceInSeconds} from 'date-fns';
import {LoggerFactory} from '../logger';

const PREFIX = '';
const REGISTERY = 'registery';
const EXPIRE_IN_SECONDS = 60 * 1;
const CACHE_DISABLED = false;

export interface CacheConfig {
  enabled?: boolean;
  key?: string;
  expireInSeconds?: number;
  evict?: string;
}
export interface CacheItem<T> {
  value: T;
  timestamp: number;
  expireInSeconds?: number;
}
export interface Registery {
  key: string;
  timestamp: number;
  expireInSeconds?: number;
  size?: number;
}

const logger = LoggerFactory.getLogger('cache');
class Cache {
  store = async (key: string, value: unknown, expireInSeconds?: number) => {
    if (CACHE_DISABLED) {
      return;
    }
    try {
      logger.debug('store', key);
      const cacheKey = PREFIX + key;
      const cacheObj: CacheItem<typeof value> = {
        value,
        timestamp: Date.now(),
        expireInSeconds,
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheObj));
      await this.addToRegistry(cacheKey);
    } catch (error) {
      console.error(error);
    }
  };

  get = async <T extends unknown>(key: String) => {
    if (CACHE_DISABLED) {
      return;
    }
    try {
      const cacheKey = PREFIX + key;
      const item = await AsyncStorage.getItem(cacheKey);
      if (!item) {
        logger.debug('no cache found', key);
        return;
      }
      logger.debug('getting data from cache', key);
      const cacheItem: CacheItem<T> = JSON.parse(item);
      if (this.isExpired(cacheItem)) {
        await AsyncStorage.removeItem(cacheKey);
        await this.removeFromRegistry(cacheKey);
        logger.debug('cache expired');
      } else {
        return cacheItem.value;
      }
    } catch (error) {
      console.error(error);
    }
  };

  isExpired = (cacheItem: CacheItem<unknown>) => {
    const expired =
      differenceInSeconds(Date.now(), cacheItem.timestamp) >
      (cacheItem.expireInSeconds ?? EXPIRE_IN_SECONDS);
    return expired;
  };

  remove = async (key: string | RegExp) => {
    if (CACHE_DISABLED) {
      return;
    }
    try {
      logger.debug('remove', key);
      if (key instanceof RegExp) {
        const registeryKey = await this.getFromRegistery(key);
        if (registeryKey) {
          await AsyncStorage.removeItem(registeryKey.key);
        }
      } else {
        await AsyncStorage.removeItem(PREFIX + key);
      }
    } catch (error) {
      console.error(error);
    }
  };

  removeBatch = async (keys: string[]) => {
    if (CACHE_DISABLED) {
      return;
    }
    try {
      if (!keys || keys.length === 0) {
        return;
      }
      logger.debug('removeBatch', keys);
      // Promise.all([
      let promises: Promise<any>[] = [];
      for (const key in keys) {
        promises.push(AsyncStorage.removeItem(key));
      }
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };

  clear = async () => {
    if (CACHE_DISABLED) {
      return;
    }
    try {
      const registryArray = await this.getRegistery();
      await AsyncStorage.multiRemove(
        registryArray.map(registery => registery.key),
      );
      await AsyncStorage.removeItem(REGISTERY);
    } catch (error) {
      console.error(error);
    }
  };

  private getRegistery = async () => {
    try {
      const registry = await AsyncStorage.getItem(REGISTERY);
      const registryArray: Registery[] = registry ? JSON.parse(registry) : [];
      return registryArray;
    } catch (error) {}
    return [];
  };

  private getFromRegistery = async (key: string | RegExp) => {
    try {
      const registryArray = await this.getRegistery();
      let foundKey;
      if (key instanceof RegExp) {
        foundKey = await registryArray.find(registery =>
          key.test(registery.key),
        );
      } else {
        foundKey = await registryArray.find(registery => key === registery.key);
      }

      return foundKey;
    } catch (error) {
      console.error(error);
    }
  };

  private addToRegistry = async (
    key: string,
    cacheItem?: CacheItem<unknown>,
  ) => {
    try {
      const registryArray = await this.getRegistery();
      registryArray.push({
        key,
        timestamp: cacheItem?.timestamp ?? Date.now(),
        expireInSeconds: cacheItem?.expireInSeconds,
      });
      await AsyncStorage.setItem(REGISTERY, JSON.stringify(registryArray));
    } catch (error) {}
  };

  private removeFromRegistry = async (key: string) => {
    try {
      const registryArray = await this.getRegistery();
      var index = registryArray.findIndex(registery => registery.key === key);
      if (index > -1) {
        registryArray.splice(index, 1);
      }
      await AsyncStorage.setItem(REGISTERY, JSON.stringify(registryArray));
    } catch (error) {}
  };
}

const cache = new Cache();

export default cache;
export {Cache};
