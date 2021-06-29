import React, {createContext, useEffect, useMemo, useRef} from 'react';
import {GeoPosition} from 'react-native-geolocation-service';
import {useImmerReducer} from 'use-immer';
import locationApi from '../api/locationApi';
import locationReducer, {
  LocationActions,
  LocationState,
} from './locationReducer';
import {Location} from '../types/DataTypes';
import {LoggerFactory} from '../utils/logger';

export interface LocationContextModel {
  state: LocationState;
  dispatch: (value: LocationActions) => void;
}

const logger = LoggerFactory.getLogger('LocationContext');
const LocationContext = createContext({} as LocationContextModel);

const LocationProvider: React.FC = (props: any) => {
  const loadingRef = useRef(false);
  const [state, dispatch] = useImmerReducer(locationReducer, {
    connected: false,
  });

  useEffect(() => {
    logger.debug('useEffect', state);
    let watchId: number;
    const init = async () => {
      const hasPermission = await locationApi.hasPermission();
      if (hasPermission) {
        watchId = locationApi.watch(
          async (position: GeoPosition) => {
            if (
              positionChanged(position, state.location) &&
              !loadingRef.current
            ) {
              loadingRef.current = true;
              const location: Location = await locationApi.getLocationFrom(
                position.coords,
              );
              if (location) {
                dispatch({
                  type: 'SET_LOCATION',
                  location,
                });
              }
              loadingRef.current = false;
            } else {
              console.log('no change in position');
            }
          },
          (error: any) => {
            console.error(error);
            dispatch({
              type: 'SET_CONNECTION',
              connected: false,
            });
          },
        );
      } else {
        console.warn('no location permission');
      }
    };
    init();
    return () => {
      if (watchId) {
        locationApi.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo(
    () => ({
      location: state.location,
      connected: state.connected,
    }),
    [state],
  );

  return (
    <LocationContext.Provider value={{state, dispatch, ...context}}>
      {props.children}
    </LocationContext.Provider>
  );
};

const positionChanged = (position: GeoPosition, location?: Location) => {
  if (
    location?.coordinate &&
    location.coordinate.latitude === position.coords.latitude &&
    location.coordinate.longitude === position.coords.longitude
  ) {
    return false;
  }
  return true;
};

export {LocationContext, LocationProvider};
