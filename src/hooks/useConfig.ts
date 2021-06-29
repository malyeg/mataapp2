import remoteConfig from '@react-native-firebase/remote-config';
import {LoggerFactory} from '../utils/logger';
// import {firebase} from '@react-native-firebase/analytics';
const defaultConfig = {
  perf_enabled: true,
  perf_api_enabled: true,
  analytics_enabled: true,
};

const logger = LoggerFactory.getLogger('useConfig');

const useConfig = () => {
  // const {setPerformanceCollectionEnabled} = usePerformance();
  const fetchConfig = async (minimumFetchIntervalMillis: number) => {
    try {
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis,
      });
      await remoteConfig().setDefaults(defaultConfig);
      const fetchedRemotely = await remoteConfig().fetchAndActivate();
      if (fetchedRemotely) {
        logger.trace('Configs were retrieved from the backend and activated.');
        logger.trace(remoteConfig().getAll());
      } else {
        logger.trace(
          'No configs were fetched from the backend, and the local configs were already activated.',
        );
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const getConfigValue = (key: keyof typeof defaultConfig) => {
    return remoteConfig().getValue(key);
  };

  const getConfig = () => {
    return remoteConfig().getAll();
  };
  return {
    fetchConfig,
    getConfigValue,
    getConfig,
  };
};

export default useConfig;
