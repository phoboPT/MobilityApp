import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import faker from 'faker';
import {ListItem, Avatar, Badge} from 'react-native-elements';
import {icons, COLORS, SIZES, images} from '../constants/index';
import {SearchBar} from 'react-native-elements';

const list = [
  {
    id: 1,
    name: 'Amy Farha',
    photoUrl: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    message: 'Hey how are you?',
    lastMessageTime: '15:09',
  },
  {
    id: 2,
    name: 'Chris Jackson',
    photoUrl: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    message: 'What are u doing ? Pick me up...',
    lastMessageTime: '13:09',
  },
];

const MessagesScreen = ({navigation}) => {
  const [search, setSearch] = useState('');

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 40}}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.menu}
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
            Messages
          </Text>
        </View>
      </View>
    );
  }
  function renderBody() {
    return (
      <View>
        <SearchBar
          placeholder="Search for messages"
          containerStyle={{borderRadius: 12}}
          inputStyle={{borderRadius: 12}}
          platform="ios"
        />
        <View>
          {list.map((l, i) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SingleMessage', {
                  user: list[i],
                })
              }>
              <ListItem key={i} bottomDivider>
                <View>
                  <Avatar
                    rounded
                    source={{uri: l.avatar_url}}
                    iconStyle={{width: 25}}
                  />
                  <Badge
                    value={1}
                    containerStyle={{position: 'absolute', top: -7, right: -7}}
                  />
                </View>
                <ListItem.Content>
                  <ListItem.Title style={{fontWeight: '700'}}>
                    {l.name}
                  </ListItem.Title>
                  <View style={{flexDirection: 'row'}}>
                    <ListItem.Subtitle style={{fontWeight: '400'}}>
                      {l.message}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={{fontWeight: '200'}}>
                      {' '}
                      - {l.lastMessageTime}
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderBody()}
    </SafeAreaView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
