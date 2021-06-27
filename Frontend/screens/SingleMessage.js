import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {icons, COLORS, SIZES, images} from '../constants/index';
import {Avatar} from 'react-native-elements';

const SingleMessage = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const {userName, userAvatar, userMessage} = route.params;

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: userMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          userName: userName,
          avatar: userAvatar,
        },
      },
      {
        _id: 2,
        text: 'Hey Paula, how are you?',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  function renderHeader() {
    return (
      <View style={{flex: 0, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            borderRadius: 20,
            width: 280,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '400',
            }}>
            {userName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile')}
          style={{
            paddingRight: SIZES.padding * 2,
            justifyContent: 'flex-end',
          }}>
          <Avatar rounded source={{uri: userAvatar}} />
        </TouchableOpacity>
      </View>
    );
  }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{marginBottom: 5, marginRight: 5}}
            size={32}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {renderHeader()}
      <GiftedChat
        messagesContainerStyle={{backgroundColor: 'white'}}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </SafeAreaView>
  );
};

export default SingleMessage;
