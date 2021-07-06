import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {icons, COLORS, SIZES, images} from '../constants/index';
import {Avatar} from 'react-native-elements';
import api from '../services/api';
import {db} from '../services/firebase';

const SingleMessage = ({navigation, route}) => {
  const [messages, setMessages] = useState([]);
  const {user} = route.params;
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentUserDetails() {
      try {
        const response = await api.get('/users/currentUser');
        setCurrentUser(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    getCurrentUserDetails();
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
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
            {user.name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile')}
          style={{
            paddingRight: SIZES.padding * 2,
            justifyContent: 'flex-end',
          }}>
          {user.photoUrl ? (
            <Avatar rounded source={{uri: user.photoUrl}} />
          ) : (
            <Avatar rounded source={images.defaultUser} />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    db.collection('chats').add({
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {renderHeader()}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="white"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}
        />
      ) : (
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={messages => onSend(messages)}
          user={{
            _id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.photoUrl,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default SingleMessage;
