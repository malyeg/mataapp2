import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import {ICredentials} from '../contexts/AuthReducer';
import {fromFirebaseUser} from '../contexts/user-model';
import Analytics from '../utils/Analytics';
import {Api} from './Api';
import profilesApi, {Profile} from './profileApi';

// const logger = LoggerFactory.getLogger('authApi');

class AuthApi extends Api {
  signIn = async (credentials: ICredentials) => {
    const userCredentials = await auth().signInWithEmailAndPassword(
      credentials.username,
      credentials.password,
    );
    if (userCredentials) {
      return await fromFirebaseUser(userCredentials.user);
    }
  };

  signInAsGuest = async () => {
    const userCredentials = await auth().signInAnonymously();
    if (userCredentials) {
      return await fromFirebaseUser(userCredentials.user);
    }
    // return response;
  };

  signUp = async (
    credentials: ICredentials,
    newProfile: Omit<Profile, 'id'>,
  ) => {
    const userCredentials = await auth().createUserWithEmailAndPassword(
      credentials.username,
      credentials.password,
    );

    if (userCredentials) {
      userCredentials.user.sendEmailVerification();
      // user.id = userCredentials.user.uid;
      const profile: Profile = {
        ...newProfile,
        id: userCredentials.user.uid,
      };
      // if (newProfile.country) {
      //   profile.country = newProfile.country;
      // }
      await profilesApi.set(userCredentials.user.uid, profile);
      const user = await fromFirebaseUser(userCredentials.user);

      return {user, profile};
    }
  };

  verifyPhone = async (phoneNumber: string) => {
    let verify = await auth()
      .verifyPhoneNumber(phoneNumber)
      .on('state_changed', phoneAuthSnapshot => {
        switch (phoneAuthSnapshot.state) {
          case auth.PhoneAuthState.CODE_SENT:
            return phoneAuthSnapshot;
          case auth.PhoneAuthState.ERROR:
            return null;
        }
      });
    return verify;
  };

  verifyCode = async (verificationId: string, code: string) => {
    let credential = auth.PhoneAuthProvider.credential(verificationId, code);
    let currentUser = auth().currentUser;
    if (!currentUser) {
      throw Error('no auth registered user found');
    }
    const userCredentials = await currentUser.linkWithCredential(credential);
    return await fromFirebaseUser(userCredentials.user);
  };

  sendPasswordResetEmail = async (email: string) => {
    // const actionCodeSettings: FirebaseAuthTypes.ActionCodeSettings = {
    //   url: 'domain',
    //   handleCodeInApp: true,
    // };
    // await auth().sendPasswordResetEmail(email, actionCodeSettings);
    await auth().sendPasswordResetEmail(email);
    Analytics.logForgotPassword(email);
  };

  changePassword = async (crednetials: ICredentials, newPassword: string) => {
    try {
      const user = auth().currentUser;
      const provider = firebase.auth.EmailAuthProvider;
      const authCredential: FirebaseAuthTypes.AuthCredential =
        provider.credential(crednetials.username, crednetials.password);
      const userCredential = await user!.reauthenticateWithCredential(
        authCredential,
      );
      await userCredential.user.updatePassword(newPassword);
      this.callAnalytics({name: 'change_password'});
    } catch (error) {
      this.callAnalytics({name: 'change_password'}, 'error', error);
      throw error;
      // An error happened.
    }
    // await auth().currentUser?.reauthenticateWithCredential().updatePassword.confirmPasswordReset(code, newPassword);
  };

  confirmPasswordReset = async (code: string, newPassword: string) => {
    await auth().confirmPasswordReset(code, newPassword);
  };

  signOut = async () => {
    await auth().signOut();
    Analytics.logSignOut();
  };

  onAuthStateChanged = (
    listnerCallback: (user: FirebaseAuthTypes.User | null) => void,
  ) => {
    return auth().onAuthStateChanged(listnerCallback);
  };
}

const authApi = new AuthApi();

export default authApi;
