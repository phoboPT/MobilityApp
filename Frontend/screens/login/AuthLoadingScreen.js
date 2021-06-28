import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View, ActivityIndicator, useColorScheme} from 'react-native';
import {COLORS} from '../../constants';

const SingleMessage = ({navigation, route}) => {
  useEffect(() => {
    async function handleUserNextScreen() {
      const userToken = await AsyncStorage.getItem('@App:userID');
      if (userToken === null) {
        navigation.navigate('SignIn');
      } else {
        navigation.navigate('Drawer');
      }
    }

    handleUserNextScreen();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default SingleMessage;
