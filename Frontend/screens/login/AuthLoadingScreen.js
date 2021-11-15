import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {COLORS} from '../../constants';
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

const AuthLoading = ({navigation, route}) => {
  useEffect(() => {
    async function handleUserNextScreen() {
      const userToken = await AsyncStorage.getItem('@App:userID');
      if (userToken === null) {
        navigation.navigate('SignInScreen');
      } else {
        navigation.navigate('Drawer');
      }
    }

    handleUserNextScreen();
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default AuthLoading;
