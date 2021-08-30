import crashlytics from '@react-native-firebase/crashlytics';
import React from 'react';
import {ErrorBoundary as EBoundary} from 'react-error-boundary';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import useConnectionCheck from '../hooks/useConnectionCheck';

const config = {
  allowInDevMode: true,
  forceAppQuit: false,
  executeDefaultHandler: false,
};

setJSExceptionHandler((_error: Error, _isFatal: boolean) => {
  errorHandler(_error);
}, config.allowInDevMode);
setNativeExceptionHandler(
  () => {
    // TODO change/customize native UI error
    // do nothing, will be catched by crashlytics
  },
  config.forceAppQuit,
  config.executeDefaultHandler,
);

const restartHandler = () => {
  RNRestart.Restart();
};

function ErrorFallback({error, resetErrorBoundary}: any) {
  return (
    <View style={styles.errorContainer}>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
      <Button title="Try again" onPress={resetErrorBoundary} />
      <Button title="restart" onPress={restartHandler} />
    </View>
  );
}

const errorHandler = (_error: Error, info?: {componentStack: string}) => {
  console.error('errorHandler:', _error, JSON.stringify(info));
  // TODO crashlytics
  if (_error instanceof Error) {
    crashlytics().recordError(_error);
  } else {
    crashlytics().recordError(new Error(_error));
  }
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const netInfo = useConnectionCheck();
  // useEffect(() => {
  //   if (netInfo.isConnected || !netInfo.isInternetReachable) {
  //     Toast.hide();
  //     Toast.show({
  //       type: 'error',
  //       text1: `connected: ${netInfo.isConnected?.toString()}, internet: ${netInfo.isInternetReachable?.toString()}`,
  //       autoHide: false,
  //     });
  //   }
  // }, [netInfo]);
  return (
    <EBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      {props.children}
    </EBoundary>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ErrorBoundary;
