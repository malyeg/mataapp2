import React from 'react';
import {enableScreens} from 'react-native-screens';
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

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ErrorBoundary>
        <LocalizationProvider>
          <AuthProvider>
            <LocationProvider>
              <Routes />
            </LocationProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ErrorBoundary>
    );
  }
};

export default App;
