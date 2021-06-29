import React, {FC} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {ErrorBoundary as EBoundary} from 'react-error-boundary';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

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
  // RNRestart.Restart();
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
  console.debug('errorHandler:', _error, JSON.stringify(info));
  // TODO crashlytics
};

const ErrorBoundary: FC = ({children}) => {
  return (
    <EBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      {children}
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
