import {PermissionsAndroid, Platform} from 'react-native';
import Geocoder from 'react-native-geocoding';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import {
  AddressComponent,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {Coordinate, Location} from '../types/DataTypes';

const opt = {
  timeout: 5000,
  maximumAge: 60000,
  enableHighAccuracy: false,
};

class LocationApi {
  hasPermission = async () => {
    let granted = false;
    if (Platform.OS === 'android') {
      const andGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      granted = andGranted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const iosGranted = await Geolocation.requestAuthorization('whenInUse');
      granted = iosGranted === 'granted';
    }
    return granted;
  };

  getCurrentPosition = () => {
    return new Promise<GeoPosition>(function (resolve, reject) {
      Geolocation.getCurrentPosition(resolve, reject, opt);
    });
  };

  // @Cacheable
  getCurrentLocation = async () => {
    try {
      const position = await this.getCurrentPosition();
      const location = await this.getLocationFrom(position.coords);
      return location;
    } catch (error) {
      console.error(error);
      throw this.getError(error);
    }
  };

  getLocationFrom = async (coordinate: Coordinate) => {
    const placeJson = await Geocoder.from(coordinate);

    const loc = this.buildLocationFromPlace(
      placeJson.results[0] as unknown as GooglePlaceDetail,
    );
    loc.coordinate = coordinate;
    return loc;
  };

  buildLocationFromPlace = (detail: GooglePlaceDetail) => {
    const add = this.getFromComponents(detail.address_components);
    const loc: Location = {
      coordinate: {
        latitude: detail.geometry.location.lat,
        longitude: detail.geometry.location.lng,
      },
      address: {
        name: detail.formatted_address,
        formattedAddress: detail.formatted_address,
      },
      placeId: detail.place_id,
      city: add.locality ?? add.state?.replace('Governorate', '').trim(),
      country: add.country,
    };
    return loc;
  };

  private getFromComponents = (components: AddressComponent[]) => {
    return components.reduce(
      (acc, {types, short_name: sname, long_name: lname}) => {
        const type = types[0];

        switch (type) {
          case 'route':
            return {...acc, route: lname};
          case 'administrative_area_level_1':
            return {...acc, state: lname};
          case 'locality':
            return {...acc, locality: lname};
          case 'administrative_area_level_1':
            return {...acc, state: lname};
          case 'country':
            return {...acc, country: {name: lname, code: sname}};
          case 'postal_code_prefix':
            return {...acc, postalCodePrefix: lname};
          case 'street_number':
            return {...acc, streetNumber: lname};
          default:
            return acc;
        }
      },
      {},
    ) as {
      country: {name: string; code: string};
      locality?: string;
      state?: string;
      route?: string;
      streetNumber?: string;
    };
  };

  private getError = (error: Error) => {
    // https://github.com/Agontuk/react-native-geolocation-service#error-codes
    const code: string = (error as unknown as {code: string}).code ?? 'other';
    switch (code) {
      case '1':
        return {code: 'location/permissionDenied', message: error.message};
      case '2':
        return {code: 'location/positionUnavailable', message: error.message};
      case '3':
        return {code: 'location/timeout', message: error.message};
      default:
        return {code: 'location/serviceNotAvailable', message: error.message};
    }
  };

  watch = (
    successCallback: Geolocation.SuccessCallback,
    errorCallback: Geolocation.ErrorCallback,
  ) => {
    return Geolocation.watchPosition(successCallback, errorCallback, {
      interval: 60000,
      useSignificantChanges: true,
    });
  };

  clearWatch = (watchId: number) => {
    Geolocation.clearWatch(watchId);
  };
}

const locationApi = new LocationApi();

export default locationApi;
