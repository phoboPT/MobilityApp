import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Avatar, Title, Caption, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import api from '../services/api';

import {COLORS, icons, images} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 12,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});
export function DrawerContent(props) {
  const [user, setUser] = useState(null);
  async function signOut() {
    try {
      await api.get('/users/signout');
      await AsyncStorage.removeItem('@App:userID');
    } catch (err) {
      console.log(err);
      await AsyncStorage.removeItem('@App:userID');
      props.navigation.reset({
        index: 0,
        routes: [{name: 'SignInScreen'}],
      });
    }
  }

  useEffect(() => {
    async function getCurrentUserDetails() {
      try {
        const response = await api.get('/users/currentUser');
        setUser(response.data);
        if (response.data.photoUrl == null) {
          console.log('este utilizador nao tem foto');
        } else {
          await AsyncStorage.setItem('@App:userIMAGE', response.data.photoUrl);
        }
      } catch (err) {
        AsyncStorage.removeItem('@App:userID');
        props.navigation.reset({
          index: 0,
          routes: [{name: 'SignInScreen'}],
        });
      }
    }
    getCurrentUserDetails();
  }, []);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          {user ? (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('MyProfile');
              }}>
              <View style={styles.userInfoSection}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  {user.photoUrl ? (
                    <Avatar.Image
                      source={{
                        uri: user.photoUrl,
                      }}
                      size={50}
                    />
                  ) : (
                    <Avatar.Image source={images.defaultUser} size={50} />
                  )}
                  <View style={{marginLeft: 15, flexDirection: 'column'}}>
                    <Title style={styles.title}>{user.name}</Title>
                    <Caption style={styles.caption}>{user.email}</Caption>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Image
                  source={icons.home}
                  name="home-outline"
                  style={{
                    tintColor: COLORS.primary,
                    resizeMode: 'contain',
                    height: 24,
                    width: 24,
                  }}
                />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Image
                  source={icons.routes}
                  name="messages"
                  style={{
                    tintColor: COLORS.primary,
                    resizeMode: 'contain',
                    height: 24,
                    width: 24,
                  }}
                />
              )}
              label="Requests"
              onPress={() => {
                props.navigation.navigate('My Routes');
              }}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Image
                  source={icons.settings}
                  name="settings-outline"
                  style={{
                    tintColor: COLORS.primary,
                    resizeMode: 'contain',
                    height: 24,
                    width: 24,
                  }}
                />
              )}
              label="Settings"
              onPress={() => {
                props.navigation.navigate('Settings');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Image
                  source={icons.settings}
                  name="settings-outline"
                  style={{
                    tintColor: COLORS.primary,
                    resizeMode: 'contain',
                    height: 24,
                    width: 24,
                  }}
                />
              )}
              label="Statistics"
              onPress={() => {
                props.navigation.navigate('Statistics');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Image
              name="exit-to-app"
              source={icons.signout}
              style={{
                tintColor: COLORS.gray,
                resizeMode: 'contain',
                height: 24,
                width: 24,
              }}
            />
          )}
          label="Sign Out"
          onPress={() => signOut()}
        />
      </Drawer.Section>
    </View>
  );
}
