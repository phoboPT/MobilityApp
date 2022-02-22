import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import Form from 'react-native-basic-form';
import api from '../../services/api';
import {NativeModules} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {StackActions, NavigationActions} from 'react-navigation';
import Inputs from '../../components/UserInputs';

const {HAR_Module} = NativeModules;
const {ReportModuleManager} = NativeModules;
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
      console.log(err);
      if (err.data.errors[0].message !== undefined) {
        Alert.alert(err.data.errors[0].message);
      } else {
        Alert.alert('Error! Please try again!');
      }
      setLoading(false);
    }
  }
  const onPress_HAR_Begin_Service = () => {
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');

    HAR_Module.HAR_Begin_Service();
  };

  const onPress_ReportCalculateReportNow = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    ReportModuleManager.CalculateCurrentReport();
  };

  const onPress_HAR_Stop_Service = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    HAR_Module.HAR_Stop_Service();
  };

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
        <Button
          title="Start Activity Recognition Service"
          color="#841584"
          onPress={() => onPress_HAR_Begin_Service()}
        />
        <Text> </Text>
        <Button
          title="Stop Activity Recognition Service"
          color="#841584"
          onPress={() => onPress_HAR_Stop_Service()}
        />

        <View />
      </View>
    </View>
  );
};

export default SignInScreen;
