import {useContext} from 'react';
import authApi from '../api/authApi';
import profilesApi, {Profile} from '../api/profileApi';
import {AuthContext} from '../contexts/AuthContext';
import {AuthActionType, ICredentials} from '../contexts/AuthReducer';

const useAuth = () => {
  const authContext = useContext(AuthContext);

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
    const updatedProfile = await profilesApi.update(profile, {
      analyticsEvent: {name: 'update_profile'},
      cache: {enabled: true},
    });
    await profilesApi.saveToStorage(profile);
    authContext.dispatch({
      type: AuthActionType.SET_PROFILE,
      payload: {profile: updatedProfile},
    });
    return updatedProfile;
  };

  return {
    user: authContext.state?.user!,
    profile: authContext.state?.profile,
    signUp: authContext.signUp,
    signIn,
    signOut: authContext.signOut,
    sendPasswordResetEmail,
    updateProfile,
    changePassword,
  };
};

export default useAuth;
