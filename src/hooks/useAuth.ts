import {useContext} from 'react';
import authApi from '../api/authApi';
import profilesApi, {Profile} from '../api/profileApi';
import {AuthContext} from '../contexts/AuthContext';
import {AuthActionType, ICredentials} from '../contexts/AuthReducer';

const useAuth = () => {
  const authContext = useContext(AuthContext);
  const {user, profile} = authContext.state;

  const signIn = async (credentials: ICredentials) => {
    try {
      const userCredentials = await authContext.signIn(credentials);
      // Analytics.logLogin(AuthMethod.CREDENTIALS);
      return userCredentials;
    } catch (error) {
      const err = error.code ?? error.message;
      authApi.callAnalytics({name: 'login', params: {error: err}}, 'error'); // TODO move to authApi
      throw error;
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    await authApi.sendPasswordResetEmail(email);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    const crednetials: ICredentials = {
      username: authContext.state.user?.username!,
      password: oldPassword,
    };
    await authApi.changePassword(crednetials, newPassword);
  };
  const updateProfile = async (profile: Profile) => {
    await profilesApi.update(profile.id, profile, {
      analyticsEvent: {name: 'update_profile'},
    });
    console.log('updateProfile', profile);
    await profilesApi.saveToStorage(profile);
    authContext.dispatch({
      type: AuthActionType.SET_PROFILE,
      payload: {profile},
    });
  };

  const addTargetCategory = async (categoryId: string) => {
    if (authContext.state.profile) {
      await profilesApi.addTargetCategory(
        authContext.state.profile?.id!,
        categoryId,
      );
      const targetCategories = authContext.state.profile.targetCategories ?? [];
      targetCategories.push(categoryId);
      const newProfile = {...authContext.state.profile, targetCategories};
      profilesApi.saveToStorage(newProfile);
      authContext.dispatch({
        type: AuthActionType.SET_PROFILE,
        payload: {profile: newProfile},
      });
    }
  };

  const loadProfile = async () => {
    const freshProfile = await profilesApi.getById(authContext.state.user?.id!);
    if (freshProfile) {
      authContext.dispatch({
        type: AuthActionType.SET_PROFILE,
        payload: {profile: freshProfile},
      });
    }
    return freshProfile;
  };

  const getName = () => {
    return profile?.firstName
      ? profile?.firstName + ' ' + profile?.lastName
      : profile?.email ?? 'Guest';
  };

  return {
    user: user!,
    shardUser: {
      id: user?.id!,
      name: getName()!,
      email: user?.username!,
    },
    profile: authContext.state?.profile,
    signUp: authContext.signUp,
    signIn,
    signOut: authContext.signOut,
    sendPasswordResetEmail,
    updateProfile,
    changePassword,
    loadProfile,
    addTargetCategory,
    getName,
  };
};

export default useAuth;
