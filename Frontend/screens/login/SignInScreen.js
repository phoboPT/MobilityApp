import React, {useState} from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import api from '../../services/api';
import {NativeModules} from 'react-native';
import images from '../../constants/images';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Center,
  Image,
  NativeBaseProvider,
} from 'native-base';
import {ImageBackground} from 'react-native';
import {Dimensions} from 'react-native';
const {
  HAR_Module,
  ReportModuleManager,
  RecommendationsManager,
  ActivitiesDatabaseModule,
} = NativeModules;

const SignInScreen = ({navigation}) => {
  async function saveUser(user) {
    await AsyncStorage.setItem('@App:userID', JSON.stringify(user));
  }

  // temail@testdefff.com
  async function onSubmit() {
    try {
      const response = await api.post('/users/signin', {
        email: formData.email,
        password: formData.password,
      });
      saveUser(response.data.id);

      navigation.navigate('Drawer');
    } catch (err) {
      console.log(err);
      if (err.data.errors[0].message !== undefined) {
        Alert.alert(err.data.errors[0].message);
      } else {
        Alert.alert('Error! Please try again!');
      }
    }
  }

  const [formData, setData] = React.useState({});

  return (
    <NativeBaseProvider>
      <ImageBackground
        source={images.logo}
        style={{
          height: Dimensions.get('screen').height / 2.5,
        }}></ImageBackground>
      <Center w="100%" bgColor="blueGray.800">
        <Box safeArea p="2" py="2" w="90%" maxW="290">
          <Heading
            size="lg"
            fontWeight="600"
            color="white"
            _dark={{
              color: 'warmGray.50',
            }}>
            Mobility Service
          </Heading>
          <Heading
            mt="1"
            _dark={{
              color: 'warmGray.200',
            }}
            color="coolGray.400"
            fontWeight="medium"
            size="xs">
            Sign in to continue!
          </Heading>

          <VStack space={5} mt="3">
            <FormControl>
              <FormControl.Label>
                {' '}
                <Text color="white">Email ID</Text>
              </FormControl.Label>
              <Input
                placeholder="user@email.com"
                onChangeText={value => setData({...formData, email: value})}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                <Text color="white">Password</Text>
              </FormControl.Label>
              <Input
                type="password"
                onChangeText={value => setData({...formData, password: value})}
              />
            </FormControl>
            <Button onPress={onSubmit} mt="2" colorScheme="indigo">
              Sign in
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text
                fontSize="sm"
                color="coolGray.400"
                _dark={{
                  color: 'coolGray.200',
                }}>
                I'm a new user.
              </Text>
            </TouchableOpacity>
            <HStack mt="6" justifyContent="center"></HStack>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default SignInScreen;
