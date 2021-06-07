import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Form from 'react-native-basic-form';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import {StackActions, NavigationActions} from 'react-navigation';
import {COLORS} from '../../constants';

const SignUpScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const fields = [
    {name: 'name', label: 'Name', required: true, autoCapitalize: 'none'},
    {
      name: 'username',
      label: 'Username',
      required: true,
      autoCapitalize: 'none',
    },
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

  async function saveUser(user) {
    await AsyncStorage.setItem('@App:userToken', JSON.stringify(user));
  }

  // trreste@tesddt.com
  async function onSubmit(state) {
    setLoading(true);
    try {
      const response = await api.post('/signup', {
        name: state.name,
        username: state.username,
        email: state.email,
        password: state.password,
      });

      const token = response.data;
      await saveUser(token);

      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'App'})],
      });

      setLoading(false);

      navigation.dispatch(resetAction);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  }

  let formProps = {title: 'Register', fields, onSubmit, loading};

  return (
    <View style={styles.container}>
      <View style={styles.master}>
        <Text style={styles.header}>Mobility One</Text>
        <Text style={styles.subHeader}>Register</Text>
        <Form {...formProps}>
          <View style={styles.link}>
            <Text style={styles.text}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignInScreen')}>
              <Text style={styles.text}>Sign In Here.</Text>
            </TouchableOpacity>
          </View>
        </Form>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  master: {
    marginTop: 100,
    alignContent: 'center',
    padding: 20,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 18,
    fontWeight: '300',
    alignSelf: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 18,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 16,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default SignUpScreen;
