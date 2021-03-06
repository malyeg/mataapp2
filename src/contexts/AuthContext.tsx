// import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import RNRestart from 'react-native-restart';
import auth from '../api/authApi';
import profilesApi, {Profile} from '../api/profileApi';
import useCrashlytics from '../hooks/useCrashlytics';
import useMessaging from '../hooks/useMessaging';
import Analytics from '../utils/Analytics';
import {LoggerFactory} from '../utils/logger';
import AuthReducer, {
  AuthActionType,
  IAuthAction,
  IAuthState,
  ICredentials,
} from './AuthReducer';
import {fromFirebaseUser, User} from './user-model';

export interface UserCredentials {
  user: User;
  token: string;
}

export interface IAuthContextModel {
  state: IAuthState;
  signIn(credentials: ICredentials): Promise<User | undefined>;
  signUp(
    credentials: ICredentials,
    profile: Partial<Profile>,
  ): Promise<User | undefined>;
  signOut: () => void;
  dispatch: (value: IAuthAction) => void;
}

const initialState: IAuthState = {
  user: undefined!,
  isAuthenticated: false,
};

export enum AuthMethod {
  CREDENTIALS = 'CREDENTIALS',
}

const logger = LoggerFactory.getLogger('AuthContext');
const AuthContext = createContext({} as IAuthContextModel);

const updateToken = (token: string, profile: Profile) => {
  if (profile?.token !== token) {
    logger.debug('updating token');
    return profilesApi.updateToken(profile, token);
  }
};

const AuthProvider: React.FC = (props: any) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const [initializing, setInitializing] = useState(true);
  const crashlytics = useCrashlytics();

  const messaging = useMessaging();
  var authFlag = true; // workaround for onAuthStateChanged twice calls
  // const [connected, setConnected] = useState(false);
  const onAuthStateChanged = async (fbUser: any) => {
    try {
      const profile = await profilesApi.getFromStorage();
      setInitializing(value => {
        if (value && authFlag) {
          logger.debug('onAuthStateChanged');
          authFlag = false;
          const user = fromFirebaseUser(fbUser);
          crashlytics.setUser(user);
          Analytics.setUser(user);
          messaging.getToken().then(token => {
            if (token) {
              updateToken(token, profile!);
            }
          });
          dispatch({
            type: AuthActionType.SIGNIN,
            payload: {user, profile},
          });
        }
        return false;
      });
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    logger.debug('useEffect');
    let tokenUnsubscribe: Function;
    const load = async () => {
      const profile = await profilesApi.getFromStorage();
      if (profile) {
        tokenUnsubscribe = messaging.onTokenRefresh(token =>
          updateToken(token, profile),
        );
      }
    };
    load();
    const authUnsubscribe = auth.onAuthStateChanged(onAuthStateChanged);

    return () => {
      authUnsubscribe();
      if (tokenUnsubscribe) {
        tokenUnsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const context = useMemo(
    () => ({
      signIn: async (credentials: ICredentials) => {
        logger.debug('signIn');
        const user = await auth.signIn(credentials);
        const profile = await profilesApi.getById(user?.id!);

        if (user && profile) {
          await profilesApi.saveToStorage(profile);
          crashlytics.setUser(user);
          Analytics.setUser(user);
          messaging.getToken().then(token => {
            if (token) {
              updateToken(token, profile);
            }
          });
          dispatch({
            type: AuthActionType.SIGNIN,
            payload: {user, profile},
          });
          return user;
        }
      },
      signUp: async (
        credentials: ICredentials,
        newProfile: Omit<Profile, 'id'>,
      ) => {
        const response = await auth.signUp(credentials, newProfile);

        if (response) {
          profilesApi.saveToStorage(response.profile);
          messaging.getToken().then(token => {
            if (token) {
              updateToken(token, response.profile);
            }
          });
          Analytics.logSignUp(AuthMethod.CREDENTIALS, response.user);
          dispatch({
            type: AuthActionType.SIGNUP,
            payload: {
              user: response.user,
              profile: response.profile,
            },
          });
        }
        return response;
      },
      signOut: async () => {
        try {
          await profilesApi.removeFromStorage();
          await auth.signOut();
        } finally {
          dispatch({
            type: AuthActionType.SIGNOUT,
          });
          // RNRestart.Restart();
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return initializing ? null : (
    <AuthContext.Provider value={{state, dispatch, ...context}}>
      {props.children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
