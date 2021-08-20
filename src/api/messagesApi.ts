import {IMessage} from 'react-native-gifted-chat';
import {DataSearchable, Document, Entity} from '../types/DataTypes';
import {DataApi} from './DataApi';

export interface ChatUser {
  _id: string;
  name?: string;
  avatar?: string;
}
export interface Message extends DataSearchable, Entity, IMessage {
  id: string;
  _id: string | number;
}

class MessagesApi extends DataApi<Message> {
  constructor() {
    super('messages');
  }

  docMapper(doc: Document<Message>) {
    const docData = doc.data();

    const timestamp = (doc.data()?.timestamp as any)?.toDate();
    const message: Message = {
      id: doc.id,
      _id: doc.id,
      text: docData.text,
      createdAt: timestamp,
      user: {
        _id: docData.user._id,
      },
    };
    return message;
  }
}

const messagesApi = new MessagesApi();

export default messagesApi;
