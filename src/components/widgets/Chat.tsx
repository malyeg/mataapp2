import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Bubble,
  Composer,
  Day,
  GiftedChat,
  IMessage,
  Send,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Deal} from '../../api/dealsApi';
import messagesApi from '../../api/messagesApi';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';

interface ChatProps {
  deal: Deal;
  disableComposer?: boolean;
  alwaysShowSend?: boolean;
}
const Chat = ({deal, disableComposer, alwaysShowSend}: ChatProps) => {
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  //   const {request} = useApi();
  const {user} = useAuth();

  useEffect(() => {
    const messagesUnsubscribe = messagesApi.collection
      .where('dealId', '==', deal.id)
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        querySnapshot => {
          const messages: IMessage[] = querySnapshot.docs.map(doc => {
            const docData = doc.data();

            const timestamp = (doc.data()?.timestamp as any)?.toDate();
            const message: IMessage = {
              _id: doc.id,
              text: docData.text,
              createdAt: timestamp,
              user: {
                _id: docData.user._id,
              },
            };
            return message;
          });

          setChatMessages(prevMessages => {
            if (messages?.length > 0 && messages.length > prevMessages.length) {
              return messages;
            }
            return prevMessages;
          });
        },
        error => console.error(error),
      );

    return messagesUnsubscribe;
  }, [deal]);
  const renderSend = useCallback(
    props => (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Icon name="send-circle" color={theme.colors.salmon} size={35} />
      </Send>
    ),
    [],
  );

  const onSend = useCallback(async (newMessages = []) => {
    const lastMessage = newMessages[newMessages.length - 1];
    lastMessage.userId = user.id;
    lastMessage.dealId = deal.id;
    console.log('lastMessage', lastMessage);
    await messagesApi.set(lastMessage._id, {
      ...lastMessage,
      dealId: deal.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBubble = useCallback(
    props => (
      <Bubble
        {...props}
        // bottomContainerStyle={{right: styles.rightText, left: styles.leftText}}
        textStyle={{right: styles.rightText, left: styles.leftText}}
        wrapperStyle={{right: styles.rightBubble, left: styles.leftBubble}}
      />
    ),
    [],
  );

  const renderComposer = useCallback(
    props => (disableComposer ? <></> : <Composer {...props} />),
    [disableComposer],
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messagesContainerStyle={styles.messagesContainer}
        timeTextStyle={{right: styles.rightText, left: styles.leftText}}
        renderBubble={renderBubble}
        renderSend={renderSend}
        messages={chatMessages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.id,
        }}
        disableComposer={disableComposer}
        alwaysShowSend={alwaysShowSend}
        // renderComposer={renderComposer}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  sendContainer: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    // backgroundColor: 'blue',
  },
  rightBubble: {
    backgroundColor: theme.colors.lightGrey,
  },
  leftBubble: {
    backgroundColor: theme.colors.rose,
  },
  rightText: {
    color: theme.colors.dark,
  },
  leftText: {
    color: theme.colors.dark,
  },
  day: {
    color: 'red',
  },
});
