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
const {
  HAR_Module,
  ReportModuleManager,
  RecommendationsManager,
  ActivitiesDatabaseModule,
} = NativeModules;

const SignInScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
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

  const [formData, setData] = React.useState({});

  return (
    <NativeBaseProvider>
      <Center w="100%">
        <HStack mt="5" justifyContent="center">
          <Image source={images.logo} size={200} borderRadius={100} />
        </HStack>
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading
            size="lg"
            fontWeight="600"
            color="coolGray.800"
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
            color="coolGray.600"
            fontWeight="medium"
            size="xs">
            Sign in to continue!
          </Heading>

          <VStack space={5} mt="5">
            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input
                placeholder="user@email.com"
                onChangeText={value => setData({...formData, email: value})}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
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
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
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
