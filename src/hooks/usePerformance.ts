import perf, {FirebasePerformanceTypes} from '@react-native-firebase/perf';

const usePerformance = () => {
  // perf().
  return {
    newHttpMetric: (
      url: string,
      httpMethod: FirebasePerformanceTypes.HttpMethod,
    ) => perf().newHttpMetric(url, httpMethod),
    newTrace: (identifier: string) => perf().newTrace(identifier),
    startTrace: (identifier: string) => perf().startTrace(identifier),
    isPerformanceCollectionEnabled: perf().isPerformanceCollectionEnabled,
    setPerformanceCollectionEnabled: (enabled: boolean) =>
      perf().setPerformanceCollectionEnabled(enabled),
  };
};
export default usePerformance;
