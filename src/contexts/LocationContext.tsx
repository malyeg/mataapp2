import React, {createContext, useEffect, useMemo, useRef} from 'react';
import {GeoPosition} from 'react-native-geolocation-service';
import {useImmerReducer} from 'use-immer';
import locationApi, {Location} from '../api/locationApi';
import locationReducer, {
  LocationActions,
  LocationState,
} from './locationReducer';
import {LoggerFactory} from '../utils/logger';
import useAuth from '../hooks/useAuth';

export interface LocationContextModel {
  // state: LocationState;
  connected: boolean;
  location?: Location;
  dispatch: (value: LocationActions) => void;
}

const logger = LoggerFactory.getLogger('LocationContext');
const LocationContext = createContext({} as LocationContextModel);

const LocationProvider: React.FC = (props: any) => {
  const loadingRef = useRef(false);
  const {profile} = useAuth();
  const [state, dispatch] = useImmerReducer(locationReducer, {
    connected: false,
  } as LocationState);

  useEffect(() => {
    const loadLocation = async () => {
      const lastKnownLocation = await locationApi.getLastKnownLocation();
      if (lastKnownLocation) {
        dispatch({
          type: 'SET_LOCATION',
          location: lastKnownLocation,
        });
      } else {
        logger.warn('no lastKnownLocation found');
        dispatch({
          type: 'SET_LOCATION',
          location: {city: profile?.city?.name!, country: profile?.country!},
        });
      }
    };
    let watchId: number;
    logger.debug('useEffect');
    const watchLocation = async () => {
      logger.debug('useEffect, init');
      const hasPermission = await locationApi.hasPermission();
      if (hasPermission) {
        logger.debug('hasPermission', hasPermission);
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
                logger.debug('location found');
                await locationApi.saveLastKnownLocation(location);
                dispatch({
                  type: 'SET_LOCATION',
                  location,
                });
              } else {
                console.warn('no location found', location);
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
        // TODO show error/warning
        logger.warn('no location permission');
      }
    };
    loadLocation();
    watchLocation();
    return () => {
      if (watchId) {
        locationApi.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo(
    () =>
      ({
        location: state.location,
        connected: state.connected,
      } as LocationState),
    [state],
  );

  return (
    <LocationContext.Provider value={{dispatch, ...context}}>
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
