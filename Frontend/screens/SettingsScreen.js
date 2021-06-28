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
    avatar_url: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    message: 'Hey how are you?',
    lastMessageTime: '15:09',
  },
  {
    id: 2,
    name: 'Chris Jackson',
    avatar_url: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    message: 'What are u doing ? Pick me up...',
    lastMessageTime: '13:09',
  },
];

const SettingsScreen = ({navigation}) => {
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
            Settings
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Messages')}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.settings}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return <SafeAreaView style={styles.container}>{renderHeader()}</SafeAreaView>;
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
