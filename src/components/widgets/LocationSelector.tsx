import React, {FC, useRef, useState} from 'react';
import {Pressable, StyleSheet, View, ViewProps} from 'react-native';
import MapView, {MapEvent, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Modal from 'react-native-modal';
import {useImmer} from 'use-immer';
import locationApi from '../../api/locationApi';
import constants from '../../config/constants';
import useLocale from '../../hooks/useLocale';
import useController from '../../hooks/userController';
import {Coordinate, Location} from '../../types/DataTypes';
import {Button} from '../core';
import {Error, KeyboardView} from '../form';
import LocationSearch from './LocationSearch';
import ModalView from './ModalView';

const summaryDelta = {
  latitudeDelta: 1,
  longitudeDelta: 1,
};
const detailsDelta = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface LocationSelectorProps extends ViewProps {
  control: any;
  name?: string;
  defaultValue?: Location;
  onChange?: (location: Location) => void;
}
const LocationSelector = ({
  name = 'location',
  onChange,
  style,
  defaultValue,
  control,
}: LocationSelectorProps) => {
  const {t} = useLocale('common');
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [location, setLocation] = useImmer<Location>(defaultValue!);
  const mapSummaryRef = useRef<any>();
  const mapDetailsRef = useRef<any>();

  const {field, formState} = useController({
    control,
    name,
    defaultValue,
  });

  const openModal = () => {
    console.log('open location');
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const onConfirm = async () => {
    let loc = location;
    if (!location.city) {
      loc = await locationApi.getLocationFrom(location.coordinate);
    }
    field.value = loc;
    field.onChange(loc);
    updateMap(loc.coordinate, 'summary');
    if (onChange) {
      onChange(loc);
    }
    setModalVisible(false);
  };
  const onSelectMarker = (
    event: MapEvent<{
      placeId?: string;
      name?: string;
    }>,
  ) => {
    onSelectLocation(event);
  };

  const onSelectLocation = async (
    event: MapEvent<{
      placeId?: string;
      name?: string;
    }>,
  ) => {
    let loc: Location;
    if (event.nativeEvent.name) {
      loc = {
        coordinate: {
          ...event.nativeEvent.coordinate,
        },
        address: {
          name: event.nativeEvent.name,
          formattedAddress: event.nativeEvent.name,
        },
      };
    } else {
      loc = await locationApi.getLocationFrom(event.nativeEvent.coordinate);
    }
    setLocation(loc);
    updateMap(loc.coordinate, 'details');
  };
  const onSelectPlace = (loc: Location) => {
    const newCords: Coordinate = {
      latitude: loc.coordinate.latitude,
      longitude: loc.coordinate.longitude,
      ...summaryDelta,
    };
    updateMap(newCords, 'details');
    setLocation(loc);
    // setCoordinate(newCords);
  };
  const updateMap = (coords: Coordinate, type: 'summary' | 'details') => {
    const ref = type === 'details' ? mapDetailsRef : mapSummaryRef;

    const delta = type === 'details' ? detailsDelta : summaryDelta;
    ref.current.fitToSuppliedMarkers({...coords, ...delta});
    ref.current.animateToRegion({...coords, ...delta}, 1000);
  };
  return (
    <Pressable style={[styles.container, style]} onPress={openModal}>
      <MapView
        ref={mapSummaryRef}
        provider={PROVIDER_GOOGLE}
        // onPress={openModal}
        style={styles.map}
        zoomEnabled={false}
        scrollEnabled={false}
        showsUserLocation={false}
        region={
          location
            ? {
                ...location.coordinate,
                ...summaryDelta,
              }
            : undefined
        }
        initialRegion={constants.maps.DEFAULT_LOCATION}
        // fitToSuppliedMarkers={true}
        // minZoomLevel={10}
      >
        {!!location?.coordinate && <Marker coordinate={location.coordinate} />}
      </MapView>
      {formState.errors[name] && <Error error={formState.errors[name]} />}
      <Modal
        style={[styles.modal]}
        useNativeDriver={true}
        isVisible={isModalVisible}
        swipeDirection={['down']}
        hideModalContentWhileAnimating={true}
        onBackButtonPress={closeModal}
        propagateSwipe>
        <ModalView
          title={t('location.title')}
          onClose={closeModal}
          style={styles.container}>
          <LocationSearch
            style={styles.search}
            initialLocation={location}
            onChange={onSelectPlace}
          />
          <MapView
            ref={mapDetailsRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            zoomEnabled={true}
            scrollEnabled={true}
            toolbarEnabled={true}
            showsUserLocation={false}
            initialRegion={
              location?.coordinate
                ? {
                    ...location?.coordinate,
                    ...detailsDelta,
                  }
                : constants.maps.DEFAULT_LOCATION
            }
            zoomControlEnabled={true}
            zoomTapEnabled={true}
            onPress={onSelectLocation}
            onPoiClick={onSelectMarker}>
            {!!location?.coordinate && (
              <>
                <Marker
                  coordinate={location.coordinate}
                  // title={location.address?.name}
                />
                {/* <Circle
                  radius={500}
                  center={location.coordinate}
                  fillColor="rgba(0,0,0,0.2)"
                /> */}
              </>
            )}
          </MapView>
          <KeyboardView style={styles.confirmButtonContainer}>
            <Button title="confirm" onPress={onConfirm} />
          </KeyboardView>
        </ModalView>
      </Modal>
    </Pressable>
  );
};

export default React.memo(LocationSelector);

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
    // backgroundColor: 'grey',
    zIndex: 1,
  },
  search: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  map: {
    flex: 1,
    height: 100,
    backgroundColor: 'grey',
    zIndex: 1,
  },
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'grey',
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    zIndex: 3000,
    // marginHorizontal: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 30,
  },
});
