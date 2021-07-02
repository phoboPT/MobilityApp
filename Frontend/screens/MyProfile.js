import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {images, icons, COLORS, SIZES} from '../constants';
import api from '../services/api';
import {Icon} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';

const MyProfile = ({navigation}) => {
  // Render
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(false);
  const options = [
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '4', value: 4},
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
  ];

  useEffect(() => {
    async function getMyInfo() {
      try {
        const response = await api.get('/users/currentUser');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
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
              {data.contact ? (
                <View style={{marginTop: 5}}>
                  <Text style={{color: COLORS.primary}}>{data.contact}</Text>
                </View>
              ) : (
                <View style={{marginTop: 5}}>
                  <Text style={{color: COLORS.primary}}>Add Contact</Text>
                </View>
              )}
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
          <View style={{flex: 1, alignItems: 'flex-end'}}></View>
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
          <Text style={{...SIZES.h2, fontWeight: '500'}}>Biography</Text>
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
        </View>
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
});

export default MyProfile;
