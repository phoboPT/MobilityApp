import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BusScreen from '../screens/BusScreen';
import CarPoolingScreen from '../screens/CarPoolingScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}>
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#e32f45',
      }}>
      {children}
    </View>
  </TouchableOpacity>
);

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 90,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Image
                source={require('../assets/icons/home.png')}
                resizeMode="contain"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94',
                }}
              />
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{color: focused ? '#e32f45' : '#748c94', fontSize: 12}}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Image
                source={require('../assets/icons/map.png')}
                resizeMode="contain"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94',
                }}
              />
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{color: focused ? '#e32f45' : '#748c94', fontSize: 12}}>
                Map
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CarPoolingScreen"
        component={CarPoolingScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/icons/add.png')}
              resizeMode="contain"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                width: 30,
                height: 30,
                tintColor: '#fff',
              }}
            />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="BusScreen"
        component={BusScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Image
                source={require('../assets/icons/front-of-bus.png')}
                resizeMode="contain"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94',
                }}
              />
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{color: focused ? '#e32f45' : '#748c94', fontSize: 12}}>
                Schedules
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{alignItems: 'center', justifyContent: 'center', top: 10}}>
              <Image
                source={require('../assets/icons/user.png')}
                resizeMode="contain"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94',
                }}
              />
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{color: focused ? '#e32f45' : '#748c94', fontSize: 12}}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Tabs;
