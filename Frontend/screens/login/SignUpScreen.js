import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import Form from 'react-native-basic-form';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from '../../constants';
import {Alert} from 'react-native';
import {Avatar} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';

const SignUpScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const options = [
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '4', value: 4},
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
  ];

  const openPicker = () => {
    launchImageLibrary(options, response => {
      // Use launchImageLibrary to open image gallery
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        };
        setPhoto(source);
      }
    });
  };

  const removeImage = () => {
    setPhoto(null);
  };

  const fields = [
    {name: 'name', label: 'Name', required: true, autoCapitalize: 'none'},
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
    {name: 'contact', label: 'Contact', require: true},
    {name: 'biography', label: 'Biography', multiline: true},
  ];

  async function onSubmit(state) {
    setLoading(true);
    if (photo == null) {
      signUp(state, null);
    }
    try {
      const data = new FormData();
      data.append('file', photo);
      data.append('upload_preset', 'mobility-one');
      data.append('cloud_name', 'hegs');
      fetch('https://api.cloudinary.com/v1_1/hegs/image/upload', {
        method: 'post',
        body: data,
      })
        .then(res => res.json())
        .then(data => {
          if (data.secure_url !== undefined) {
            signUp(state, data.secure_url);
          }
        })
        .catch(err => {
          Alert.alert('An Error Occured While Creating');
          console.log(err.data.errors);
        });
    } catch (err) {
      Alert.alert(err);
      setLoading(false);
    }
  }

  async function signUp(state, photo) {
    try {
      const response = await api.post('/users/signup', {
        name: state.name,
        email: state.email,
        password: state.password,
        photoUrl: photo,
        biography: state.biography,
        contact: state.contact,
      });
      if (response.data !== undefined) {
        setLoading(false);
        Alert.alert('User successfully registered!');
        navigation.navigate('SignInScreen');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error creating new user!');
      setLoading(false);
    }
  }

  let formProps = {title: 'Register', fields, onSubmit, loading};

  return (
    <View style={styles.container}>
      <View style={styles.master}>
        <Text style={styles.subHeader}>Register</Text>
        {photo ? (
          <>
            <Avatar
              containerStyle={{alignSelf: 'center', marginBottom: 12}}
              rounded
              source={photo}
              size="xlarge"
            />
            <Button
              onPress={() => removeImage()}
              buttonStyle={{
                marginTop: 30,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
              }}
              titleStyle={{color: COLORS.white}}
              title="Remove Image"
            />
          </>
        ) : (
          <Button
            onPress={() => openPicker()}
            buttonStyle={{
              marginTop: 30,
              backgroundColor: COLORS.primary,
              borderRadius: 10,
            }}
            titleStyle={{color: COLORS.white}}
            title="Upload Image"
          />
        )}
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
    marginTop: 40,
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
