import React, {FC, useEffect, useRef} from 'react';
import {Platform, StyleSheet, TextStyle, View, ViewProps} from 'react-native';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import locationApi from '../../api/locationApi';
import theme from '../../styles/theme';
import {Location} from '../../types/DataTypes';

const defaultQuery: {
  components: string;
  language?: string;
} = {
  language: 'en',
  components: 'country:nz', // TODO set country from profile if exists
};
interface LocationSearchProps extends ViewProps {
  initialLocation?: Location;
  textStyle?: TextStyle;
  onChange: (location: Location) => void;
  onLocationPermissionDenied?: () => void;
  // query?: {
  //   country?: string;
  //   language?: string;
  // };
}
const LocationSearch: FC<LocationSearchProps> = ({
  onChange,
  initialLocation,
  style,
  textStyle,
  onLocationPermissionDenied,
  // query = defaultQuery,
}) => {
  const ref = useRef<any>();
  // const [listViewDisplayed, setListViewDisplayed] = useState<boolean>(true);
  useEffect(() => {
    if (!!initialLocation && !!initialLocation.address?.name) {
      ref.current?.setAddressText(initialLocation.address.name);
    }
  }, [initialLocation]);

  const setLocation = (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null,
  ) => {
    if (detail) {
      const newLoc = locationApi.buildLocationFromPlace(detail);
      onChange(newLoc);
    }
  };

  const clear = () => {
    ref.current?.setAddressText('');
  };

  const onPressCurrentLocation = async () => {
    if (locationApi.hasPermission()) {
      // const position = await locationApi.getCurrentLocation();
      const location = await locationApi.getCurrentLocation();
      ref.current?.setAddressText(location.address?.name);
      onChange(location);
    } else {
      console.error('location permission denied');
      if (onLocationPermissionDenied) {
        onLocationPermissionDenied();
      }
    }
  };

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      styles={{
        container: {...styles.inputContainer, ...(style as {})},
        textInput: {...styles.textInput, ...(textStyle as {})},
        listView: styles.listView,
      }}
      placeholder="Search"
      fetchDetails={true}
      onPress={setLocation}
      query={{
        key:
          Platform.OS === 'ios'
            ? Config.GOOGLE_MAPS_IOS_API_KEY
            : Config.GOOGLE_MAPS_ANDROID_API_KEY,
        ...defaultQuery,
      }}
      debounce={1000}
      // listViewDisplayed={listViewDisplayed ? 'auto' : false}
      textInputProps={{
        clearButtonMode: 'never',
      }}>
      <View style={styles.iconsContainer}>
        <Icon
          name="close"
          size={20}
          color={theme.colors.grey}
          style={styles.icon}
          onPress={clear}
        />
        <Icon
          name="crosshairs-gps"
          size={20}
          color={theme.colors.grey}
          style={styles.icon}
          onPress={onPressCurrentLocation}
        />
      </View>
    </GooglePlacesAutocomplete>
  );
};

export default React.memo(LocationSearch);

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
    flex: 0,
  },
  listView: {
    // flex: 1,
    zIndex: 1000,
    // top: 45,
    // position: 'absolute',
  },
  label: {
    color: theme.colors.grey,
  },
  iconsContainer: {
    zIndex: 2000,
    flexDirection: 'row',
    position: 'absolute',
    right: 5,
    top: 15,
  },
  icon: {
    marginHorizontal: 2,
    marginBottom: 3,
  },
  textInput: {
    ...theme.styles.scale.body1,
    fontWeight: theme.fontWeight.medium,
    height: 53,
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    color: theme.colors.dark,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 60,
  },
});
