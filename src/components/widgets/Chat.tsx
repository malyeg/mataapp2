import React, {useCallback} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import {Deal} from '../../api/dealsApi';
import messagesApi, {Message} from '../../api/messagesApi';
import {useFirestoreSnapshot} from '../../hooks/firebase/useFirestoreSnapshot';
import useAuth from '../../hooks/useAuth';
import theme from '../../styles/theme';
import {QueryBuilder} from '../../types/DataTypes';
import {Icon} from '../core';

interface ChatProps {
  deal: Deal;
  style?: StyleProp<ViewStyle>;
  disableComposer?: boolean;
  alwaysShowSend?: boolean;
}
const Chat = ({deal, disableComposer, style, alwaysShowSend}: ChatProps) => {
  const {data} = useFirestoreSnapshot<Message>({
    collectionName: messagesApi.collectionName,
    query: QueryBuilder.from({
      filters: [{field: 'dealId', value: deal.id}],
      orderBy: [{field: 'timestamp', direction: 'desc'}],
    }),
    docMapper: messagesApi.docMapper,
  });
  const {user} = useAuth();

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

  const renderSystemMessage = (props: any) => {
    // console.log(props);
    return (
      <SystemMessage
        {...props}
        containerStyle={styles.systemMessageContainer}
        textStyle={styles.systemMessageText}
      />
    );
  };

  const renderComposer = useCallback(
    props =>
      disableComposer ? (
        <></>
      ) : (
        <Composer
          {...props}
          textInputStyle={styles.textInput}
          multiline={false}
        />
      ),
    [disableComposer],
  );

  return (
    <View style={[styles.container, style]}>
      <GiftedChat
        messagesContainerStyle={styles.messagesContainer}
        timeTextStyle={{right: styles.rightText, left: styles.leftText}}
        renderBubble={renderBubble}
        renderSend={renderSend}
        messages={data!}
        renderInputToolbar={props =>
          !disableComposer ? (
            <InputToolbar {...props} containerStyle={styles.toolbar} />
          ) : (
            <></>
          )
        }
        renderSystemMessage={renderSystemMessage}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.id,
        }}
        disableComposer={disableComposer}
        alwaysShowSend={alwaysShowSend}
        renderComposer={renderComposer}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {},
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
  textInput: {
    color: theme.colors.dark,
  },
  toolbar: {
    borderWidth: 2,
    borderColor: theme.colors.lightGrey,
    borderRadius: 10,
  },
  chatFooter: {},
  systemMessageContainer: {
    // backgroundColor: 'grey',
  },
  systemMessageText: {
    backgroundColor: theme.colors.dark,
    color: theme.colors.white,
    padding: 10,
    borderRadius: 7,
    // borderWidth: 1,
    // bod
    overflow: 'hidden',
    fontWeight: theme.fontWeight.bold,
  },
});
