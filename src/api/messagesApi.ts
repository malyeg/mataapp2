import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';
import {DataSearchable, Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';

export interface ChatUser {
  _id: string;
  name: string;
  avatar: string;
}
export interface Message extends DataSearchable, Entity {
  id: string;
  text: string;
  user: ChatUser;
  dealId: string;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
}

class MessagesApi extends DataApi<Message> {
  constructor() {
    super(
      firestore().collection<Message>(Config.SCHEMA_PREFIX + 'messages'),
      'items',
    );
  }
}

const messagesApi = new MessagesApi();

export default messagesApi;
