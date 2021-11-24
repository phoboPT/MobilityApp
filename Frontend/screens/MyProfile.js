import React, {useEffect, useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {images, icons, COLORS, SIZES} from '../constants';
import api from '../services/api';
import {Icon} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const MyProfile = ({navigation}) => {
  // Render
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(false);
  const [biography, setBiography] = useState('');
  const [contact, setContact] = useState('');
  const [userVehicles, setUserVehicles] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const options = [
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '4', value: 4},
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
  ];

  const updateUserDetails = async bio => {
    if (bio == true) {
      setModalVisible(!modalVisible);
    } else {
      setModalVisible2(!modalVisible2);
    }
    try {
      const response = await api.post('/users/edit', {
        biography: biography,
        photoUrl:
          'https://www.pavilionweb.com/wp-content/uploads/2017/03/man.png',
        contact: contact,
      });
      getMyInfo();
    } catch (err) {
      console.log(err);
      Alert.alert('Error updating your Details!');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getMyInfo();
    }, [])
  );

  async function getMyInfo() {
    try {
      const response = await api.get('/users/currentUser');
      setData(response.data);
      setContact(response.data.contact);
      setBiography(response.data.biography);
      setPhoto(response.data.photoUrl);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function checkIfUserHasVehicles() {
      try {
        const response = await api.get('/vehicles/me');
        setUserVehicles(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    checkIfUserHasVehicles();
    getMyInfo();
  }, []);

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
        onUpdateImage();
      }
    });
  };

  const onUpdateImage = async () => {
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
  };

  if (loading) {
    return (
      <ImageBackground
        style={{flex: 1, resizeMode: 'cover'}}
        source={images.background}>
        <ActivityIndicator
          size="large"
          color="white"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}
        />
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{flex: 2}}>
        <Image
          source={images.background}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '80%',
          }}
        />
        <View
          style={[
            {
              position: 'absolute',
              bottom: '5%',
              left: '5%',
              right: '5%',
              borderRadius: 15,
              padding: SIZES.padding,
              backgroundColor: COLORS.white,
            },
            styles.shadow,
          ]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.shadow}>
              {data.photoUrl ? (
                <View>
                  <Image
                    source={{uri: data.photoUrl}}
                    resizeMode="cover"
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 15,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => openPicker()}
                    style={{flexDirection: 'row', marginTop: 10}}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        marginTop: 3,
                        marginRight: 3,
                      }}>
                      Change
                    </Text>
                    <Icon color={COLORS.primary} name="photo" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Image
                    source={images.defaultUser}
                    resizeMode="cover"
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 15,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => openPicker()}
                    style={{flexDirection: 'row', marginTop: 10}}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        marginTop: 3,
                        marginRight: 3,
                      }}>
                      Change
                    </Text>
                    <Icon color={COLORS.primary} name="photo" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View
              style={{
                marginHorizontal: SIZES.radius,
                justifyContent: 'space-around',
              }}>
              <Text style={{...SIZES.h3, fontWeight: '600'}}>{data.name}</Text>
              <Text style={{color: COLORS.gray, ...SIZES.body3}}>
                {data.email}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible2(!modalVisible2)}>
                {data.contact ? (
                  <View style={{marginTop: 5}}>
                    <Text style={{color: COLORS.primary}}>{data.contact}</Text>
                  </View>
                ) : (
                  <View style={{marginTop: 5}}>
                    <Text style={{color: COLORS.primary}}>Add Contact</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Header Buttons */}
        <View
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            right: 20,
            //height: 50,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={icons.back}
                resizeMode="cover"
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}} />
        </View>
      </View>

      {/* Body */}
      <View style={{flex: 1.5}}>
        {/* About */}

        <View
          style={{
            marginTop: SIZES.padding - 10,
            paddingHorizontal: SIZES.padding,
          }}>
          <View style={{marginBottom: 10}}>
            <Text style={{...SIZES.h1, fontWeight: '700'}}>My Cars</Text>
            <FlatList
              data={userVehicles}
              renderItem={({item}) => (
                <View style={{flexDirection: 'row'}}>
                  <Text>{item.carModel} </Text>
                  <Text style={{...SIZES.h2, fontWeight: '600'}}>
                    Car Capacity:{' '}
                  </Text>
                  <Text>{item.capacity}</Text>
                </View>
              )}
            />
          </View>
          <Text style={{...SIZES.h1, fontWeight: '600'}}>Biography</Text>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <ScrollView style={{marginBottom: 140}}>
              {data.biography ? (
                <View style={{marginTop: 5}}>
                  <Text style={{color: COLORS.primary}}>{data.biography}</Text>
                </View>
              ) : (
                <View style={{marginTop: 5}}>
                  <Text style={{color: COLORS.primary}}>Add Biography</Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  multiline
                  placeholder="Edit Biography"
                  onChangeText={text => setBiography(text)}
                  placeholderTextColor="gray"
                  showSoftInputOnFocus
                  style={styles.modalText}
                />
                <View style={{flexDirection: 'row', margin: 10}}>
                  <Button
                    title="Cancel"
                    type="outline"
                    style={{marginRight: 10}}
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                  <Button
                    style={{marginLeft: 10}}
                    title="Save"
                    onPress={() => updateUserDetails(true)}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => setModalVisible2(!modalVisible2)}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  multiline
                  placeholder="Edit Contact"
                  onChangeText={text => setContact(text)}
                  placeholderTextColor="gray"
                  showSoftInputOnFocus
                  style={styles.modalText}
                />
                <View style={{flexDirection: 'row', margin: 10}}>
                  <Button
                    title="Cancel"
                    type="outline"
                    style={{marginRight: 10}}
                    onPress={() => setModalVisible2(!modalVisible2)}
                  />
                  <Button
                    style={{marginLeft: 10}}
                    title="Save"
                    onPress={() => updateUserDetails(false)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      {/* Footer */}
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <TouchableOpacity
          style={{
            width: 200,
            marginBottom: 20,
            height: '30%',
          }}
          onPress={() => navigation.navigate('CreateVehicle')}>
          <LinearGradient
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              },
            ]}
            colors={[COLORS.primary, '#5884ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginTop: 3,
                  marginRight: 15,
                  color: COLORS.white,
                  ...SIZES.h2,
                }}>
                Create Vehicle
              </Text>
              <Image
                style={{width: 25, height: 25, tintColor: COLORS.white}}
                source={icons.frontCar}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    color: 'black',
    textAlign: 'center',
  },
});

export default MyProfile;
