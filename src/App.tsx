import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import Toast from 'react-native-toast-message';
import {toastConfig} from './components/core/Toaster';
import './config/i18n';
import {AuthProvider} from './contexts/AuthContext';
import ErrorBoundary from './contexts/ErrorBoundary';
import {LocalizationProvider} from './contexts/LocalizationContext';
import {LocationProvider} from './contexts/LocationContext';
import useResources from './hooks/useResources';
import Routes from './navigation/Routes';

enableScreens();

const App: React.FC = () => {
  const {isLoadingComplete} = useResources();
  // const netInfo = useNetInfo();
  // const {showToast} = useToast();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ErrorBoundary>
        <LocalizationProvider>
          <AuthProvider>
            <LocationProvider>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
              />
              <SafeAreaProvider>
                <Routes />
              </SafeAreaProvider>
            </LocationProvider>
          </AuthProvider>
        </LocalizationProvider>
        <Toast ref={ref => Toast.setRef(ref)} config={toastConfig} />
      </ErrorBoundary>
    );
  }
};

export default App;
