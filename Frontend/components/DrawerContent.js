import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Avatar, Title, Caption, Paragraph, Drawer} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import {COLORS, icons} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

export function DrawerContent(props) {
  function signOut() {
    AsyncStorage.removeItem('@App:userToken');
  }

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image
                source={{
                  uri: 'https://scontent.fopo3-1.fna.fbcdn.net/v/t1.6435-9/121291773_3385520941485741_5881563945087180365_n.jpg?_nc_cat=101&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=b-FvAs3nnvIAX_Bxjlp&_nc_ht=scontent.fopo3-1.fna&oh=3d40b9be37a9ca384f7b825aff2a0c64&oe=60E51042',
                }}
                size={50}
              />
              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>Hélder Gonçalves</Title>
                <Caption style={styles.caption}>@helderpgoncalves</Caption>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  100
                </Paragraph>
                <Caption style={styles.caption}>Pontos Écológicos</Caption>
              </View>
            </View>
          </View>

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
                  source={icons.map}
                  name="map-outline"
                  style={{
                    tintColor: COLORS.primary,
                    resizeMode: 'contain',
                    height: 24,
                    width: 24,
                  }}
                />
              )}
              label="Map"
              onPress={() => {
                props.navigation.navigate('Map');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Image
                  source={icons.messages}
                  style={{
                    tintColor: COLORS.primary,
                    resizeMode: 'contain',
                    height: 24,
                    width: 24,
                  }}
                  name="messages"
                />
              )}
              label="Messages"
              onPress={() => {
                props.navigation.navigate('Messages');
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
              label="Planned Routes"
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
    fontSize: 14,
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
