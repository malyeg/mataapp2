import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataSearchable, Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';
import {Country, State} from './countriesApi';
import {City} from './citiesApi';

export interface Profile extends DataSearchable, Entity {
  id: string;
  mobile: string;
  email: string;
  country?: Country;
  state?: State;
  city?: City;
  firstName?: string;
  lastName?: string;
  acceptMarketingFlag?: boolean;
  acceptTermsFlag?: boolean;
  interests?: string[];
  targetCategories?: string[];
  token?: string;
}

class ProfilesApi extends DataApi<Profile> {
  constructor() {
    super('profiles');
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

  addTargetCategory = async (userId: string, categoryId: string) => {
    this.collection.doc(userId).update({
      targetCategories: firestore.FieldValue.arrayUnion(categoryId),
    });
  };
}

const profilesApi = new ProfilesApi();

export default profilesApi;
