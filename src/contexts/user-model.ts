import {FirebaseAuthTypes} from '@react-native-firebase/auth';
// import jwtDecode from 'jwt-decode';

// const authFunc = auth();
type FirebaseUser = FirebaseAuthTypes.User;
export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  emailVerified?: boolean;
  type?: 'anonymous' | 'user';
  isAnonymous?: boolean;
  metadata?: {
    creationTime: number;
    lastSignInTime: number;
  };
}

export const fromFirebaseUser = (fbUser: any) => {
  const user: User = {
    id: fbUser.uid,
    username: fbUser.email,
    email: fbUser.email,
    emailVerified: fbUser.emailVerified,
    type: fbUser.providerId,
    isAnonymous: fbUser.isAnonymous,
    metadata: fbUser.metadata,
  };
  return user;
};
