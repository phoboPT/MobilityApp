import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './components/DrawerContent';
import {
  HomeScreen,
  SettingsScreen,
  MessagesScreen,
  MyRoutesScreen,
  SignInScreen,
  SignUpScreen,
} from './screens';
import AsyncStorage from '@react-native-community/async-storage';
import {View, ActivityIndicator} from 'react-native';
import {COLORS} from './constants';
import {createStackNavigator} from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  function AuthNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Navigator>
    );
  }

  function navigationDrawer() {
    return (
      <Drawer.Navigator
        initialRouteName={HomeScreen}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Messages" component={MessagesScreen} />
        <Drawer.Screen name="My Routes" component={MyRoutesScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    );
  }

  useEffect(() => {
    async function handleUserNextScreen() {
      const token = await AsyncStorage.getItem('@App:userToken');
      setUserToken(token);
    }

    handleUserNextScreen();
  }, []);

  const [userToken, setUserToken] = useState(null);
  return (
    <NavigationContainer>
      {userToken ? AuthNavigation() : navigationDrawer()}
    </NavigationContainer>
  );
};

export default App;
