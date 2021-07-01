import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Form from 'react-native-basic-form';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import {StackActions, NavigationActions} from 'react-navigation';

const SignInScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const fields = [
    {
      name: 'email',
      label: 'Email Address',
      required: true,
      autoCapitalize: 'none',
    },
    {
      name: 'password',
      label: 'Password',
      required: true,
      secure: true,
      autoCapitalize: 'none',
    },
  ];
  let formProps = {title: 'Login', fields, onSubmit, loading};

  async function saveUser(user) {
    await AsyncStorage.setItem('@App:userID', JSON.stringify(user));
  }

  // temail@testdefff.com
  async function onSubmit(state) {
    setLoading(true);
    try {
      const response = await api.post('/users/signin', {
        email: state.email,
        password: state.password,
      });
      saveUser(response.data.id);

      setLoading(false);

      navigation.navigate('Drawer');
    } catch (err) {
      Alert.alert(
        'Our server is receiving updates!',
        'Please try again later.',
      );
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.master}>
        <Text style={styles.header}>Mobility One</Text>
        <Text style={styles.subHeader}>Login</Text>
        <Form {...formProps}>
          <View style={styles.link}>
            <Text style={styles.text}>Dont have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={styles.text}>Sign up Here.</Text>
            </TouchableOpacity>
          </View>
        </Form>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  master: {
    backgroundColor: 'white',
    marginVertical: 150,
    alignContent: 'center',
    padding: 20,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 18,
    alignSelf: 'center',
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 18,
    fontWeight: '300',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    marginTop: 16,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default SignInScreen;
