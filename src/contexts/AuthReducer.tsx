import {Profile} from '../api/profileApi';
import {User} from './user-model';
export enum AuthActionType {
  SIGNIN = 'SIGNIN',
  SIGNUP = 'SIGNUP',
  SIGNOUT = 'SIGNOUT',
  SET_PROFILE = 'SET_PROFILE',
}

export type IAuthAction =
  | {
      type: AuthActionType.SIGNIN;
      payload: {user: User; profile?: Profile};
    }
  | {
      type: AuthActionType.SIGNUP;
      payload: {user: User; profile: Profile};
    }
  | {
      type: AuthActionType.SET_PROFILE;
      payload: {profile: Profile};
    }
  | {type: AuthActionType.SIGNOUT};

export interface ICredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface IAuthState {
  user: User | undefined;
  profile?: Profile;
  isAuthenticated: boolean;
}

const logoutState: IAuthState = {
  user: undefined!,
  profile: undefined!,
  isAuthenticated: false,
};

const AuthReducer = (state: IAuthState, action: IAuthAction): IAuthState => {
  switch (action.type) {
    case AuthActionType.SIGNIN:
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
      };
    case AuthActionType.SET_PROFILE:
      //
      return {
        ...state,
        profile: action.payload.profile,
      };
    case AuthActionType.SIGNOUT:
      return logoutState;
    case AuthActionType.SIGNUP:
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
      };
    default: {
      return state;
    }
  }
};

export default AuthReducer;
