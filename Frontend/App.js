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
  DestinationDetail,
  DestinationSearch,
  Onboarding,
  UserProfile,
  SingleMessage,
} from './screens';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import Map from './components/Map';
import {navigationRef} from './navigation/RootNavigation';
import CreateCarPooling from './screens/CreateCarPooling';
import AuthLoadingScreen from './screens/login/AuthLoadingScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
  function AuthNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="SignInScreen"
          component={SignInScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SignUpScreen"
          component={SignUpScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AuthLoadingScreen"
          component={AuthLoadingScreen}
        />
      </Stack.Navigator>
    );
  }

  const navigationDrawer = () => {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={HomeScreen}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen name="Map" component={Map} />
        <Drawer.Screen name="Messages" component={MessagesScreen} />
        <Drawer.Screen name="My Routes" component={MyRoutesScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    );
  };

  const AppStack = createStackNavigator();

  const MyStack = () => {
    return (
      <AppStack.Navigator headerMode="none" initialRouteName="Onboarding">
        <AppStack.Screen name="SignIn" component={SignInScreen} />
        <AppStack.Screen name="SignUp" component={SignUpScreen} />
        <AppStack.Screen name="Drawer" component={navigationDrawer} />
        <AppStack.Screen name="Onboarding" component={Onboarding} />
        <AppStack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <AppStack.Screen
          name="DestinationSearch"
          component={DestinationSearch}
        />
        <AppStack.Screen name="CreateCarPooling" component={CreateCarPooling} />
        <AppStack.Screen name="UserProfile" component={UserProfile} />
        <AppStack.Screen name="SingleMessage" component={SingleMessage} />
        <AppStack.Screen
          name="DestinationDetail"
          component={DestinationDetail}
        />
      </AppStack.Navigator>
    );
  };

  useEffect(() => {
    async function handleUserNextScreen() {
      const token = await AsyncStorage.getItem('@App:userID');
      setUserToken(token);
    }

    handleUserNextScreen();
  }, []);

  const [userToken, setUserToken] = useState(null);
  return (
    <NavigationContainer ref={navigationRef}>{MyStack()}</NavigationContainer>
  );
};

export default App;
