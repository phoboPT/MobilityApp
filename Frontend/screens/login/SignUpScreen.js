import React, {useState} from 'react';
import {TouchableOpacity, KeyboardAvoidingView} from 'react-native';
// import Form from 'react-native-basic-form';
import api from '../../services/api';
// import {COLORS} from '../../constants';
import {Alert} from 'react-native';
import {Avatar} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
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
  // Image,
  NativeBaseProvider,
} from 'native-base';

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

  async function signUp(photo) {
    try {
      const response = await api.post('/users/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photoUrl: photo,
        biography: formData.biography,
        contact: formData.contact,
      });
      if (response.data !== undefined) {
        setLoading(false);
        Alert.alert('User successfully registered!');
        navigation.navigate('SignInScreen');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error creating new user!');
      console.log(formData.name);
      console.log(formData.email);
      console.log(formData.password);
      console.log(formData.biography);
      console.log(formData.contact);
      setLoading(false);
    }
  }

  const [formData, setData] = React.useState({});

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView behavior="position">
        <Center w="100%" h="100%" bgColor="blueGray.800">
          {photo ? (
            <>
              <HStack
                mt="20"
                alignItems={{
                  base: 'center',
                  md: 'flex-start',
                }}>
                <Avatar rounded source={photo} size="xlarge" />
              </HStack>
              <Button onPress={() => removeImage()} mt="3" colorScheme="indigo">
                Remove Image
              </Button>
            </>
          ) : (
            <Button onPress={() => openPicker()} colorScheme="indigo" mt="8">
              Upload Image
            </Button>
          )}
          <Box safeArea p="2" w="90%" maxW="290">
            <Heading
              size="lg"
              fontWeight="600"
              color="white"
              _dark={{
                color: 'warmGray.50',
              }}>
              Register
            </Heading>
            <VStack space={5} mt="3">
              <FormControl>
                <FormControl.Label>
                  {' '}
                  <Text color="white">Name</Text>
                </FormControl.Label>
                <Input
                  color="white"
                  placeholder="John Doe"
                  TextColor="white"
                  onChangeText={value => setData({...formData, name: value})}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  {' '}
                  <Text color="white">Email</Text>
                </FormControl.Label>
                <Input
                  color="white"
                  placeholder="user@email.com"
                  onChangeText={value => setData({...formData, email: value})}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color="white">Password</Text>
                </FormControl.Label>
                <Input
                  color="white"
                  type="password"
                  onChangeText={value =>
                    setData({...formData, password: value})
                  }
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  {' '}
                  <Text color="white">Biography</Text>
                </FormControl.Label>
                <Input
                  color="white"
                  placeholder="Something about Yourself"
                  onChangeText={value =>
                    setData({...formData, biography: value})
                  }
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  {' '}
                  <Text color="white">Contact</Text>
                </FormControl.Label>
                <Input
                  color="white"
                  type="number"
                  placeholder="912345678"
                  onChangeText={value => setData({...formData, contact: value})}
                />
              </FormControl>
              <Button onPress={onSubmit} mt="2" colorScheme="indigo">
                Create Account
              </Button>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignInScreen')}>
                <Text
                  fontSize="sm"
                  color="coolGray.400"
                  _dark={{
                    color: 'coolGray.200',
                  }}>
                  I already have an Account
                </Text>
              </TouchableOpacity>
            </VStack>
          </Box>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
};

export default SignUpScreen;

