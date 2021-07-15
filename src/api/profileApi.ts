import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataSearchable, Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';
import {Country, State} from './countriesApi';

export interface Profile extends DataSearchable, Entity {
  id: string;
  mobile: string;
  email: string;
  state?: State;
  country?: Country;
  firstName?: string;
  lastName?: string;
  acceptMarketingFlag?: boolean;
  acceptTermsFlag?: boolean;
  interests?: string[];
  token?: string;
}

class ProfilesApi extends DataApi<Profile> {
  constructor() {
    super(
      firestore().collection<Profile>(Config.SCHEMA_PREFIX + 'profiles'),
      'profiles',
    );
  }

  saveToStorage = (profile: Profile) => {
    return AsyncStorage.setItem('profile', JSON.stringify(profile));
  };

  getFromStorage = async () => {
    const profileJson = await AsyncStorage.getItem('profile');
    if (profileJson) {
      return JSON.parse(profileJson) as Profile;
    }
  };

  removeFromStorage = () => {
    return AsyncStorage.removeItem('profile');
  };

  updateToken = async (profile: Profile, token: string) => {
    const newProfile = {...profile, token};
    await this.update(profile.id, {token});
    await this.saveToStorage(newProfile);
    return newProfile;
  };
}

const profilesApi = new ProfilesApi();

export default profilesApi;
