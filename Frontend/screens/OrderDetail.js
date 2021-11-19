import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {images, icons, COLORS, SIZES} from '../constants';
import {ScrollView} from 'react-native';
import api from '../services/api';
import Moment from 'moment';
import {Rating, Button} from 'react-native-elements';

const StarReview = ({rate}) => {
  var starComponents = [];
  var fullStar = Math.floor(rate);
  var noStar = Math.floor(5 - rate);
  var halfStar = 5 - fullStar - noStar;

  // Full Star
  for (var i = 0; i < fullStar; i++) {
    starComponents.push(
      <Image
        key={`full-${i}`}
        source={icons.starFull}
        resizeMode="cover"
        style={{
          width: 20,
          height: 20,
        }}
      />,
    );
  }

  // Half Star
  for (var i = 0; i < halfStar; i++) {
    starComponents.push(
      <Image
        key={`half-${i}`}
        source={icons.starHalf}
        resizeMode="cover"
        style={{
          width: 20,
          height: 20,
        }}
      />,
    );
  }

  // No Star
  for (var i = 0; i < noStar; i++) {
    starComponents.push(
      <Image
        key={`empty-${i}`}
        source={icons.starEmpty}
        resizeMode="cover"
        style={{
          width: 20,
          height: 20,
        }}
      />,
    );
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {starComponents}
      <Text
        style={{marginLeft: SIZES.base, color: COLORS.gray, ...SIZES.body3}}>
        {rate}
      </Text>
    </View>
  );
};

const IconLabel = ({icon, label}) => {
  return (
    <View style={{alignItems: 'center', marginLeft: 30}}>
      <Image
        source={icon}
        resizeMode="cover"
        style={{
          tintColor: COLORS.primary,
          width: 45,
          height: 45,
        }}
      />
      <Text style={{marginTop: SIZES.padding, color: COLORS.gray, ...SIZES.h3}}>
        {label}
      </Text>
    </View>
  );
};

const OrderDetail = ({navigation, route}) => {
  const {data} = route.params;
  const [loading, setLoading] = useState(true);
  const [endLocationImage, setEndLocationImage] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [rating, setRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [cancelRequest, setCancelRequest] = useState(false);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (data.status == 'created') {
      setCancelRequest(true);
    } else if (data.status == 'accepted') {
      setRating(true);
    }
    getRouteInfo(data.routeId);
  }, []);

  async function getRouteInfo(id) {
    try {
      const response = await api.get('/routes/' + id);
      setRouteInfo(response.data);
      setBackgroundImage(response.data.endLocation);
      getUserInfo(response.data.userId);
    } catch (err) {
      Alert.alert(err);
      setLoading(true);
    }
  }

  async function getUserInfo(id) {
    try {
      const response = await api.get('/users/' + id);
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      Alert.alert(err);
      setLoading(true);
    }
  }

  const rateUser = async () => {
    setModalVisible(!modalVisible);
    console.log('O valor do rating foi de: ' + userRating);
  };

  async function cancelledOrder() {
    try {
      const response = await api.post('/orders/cancelled', {
        id: data.id,
      });
      Alert.alert('Order Cancelled!');
      navigation.navigate('My Routes');
    } catch (error) {
      console.log(error);
    }
  }

  const setBackgroundImage = endLocation => {
    if (endLocation === 'ESTG') {
      setEndLocationImage(
        'https://lh3.googleusercontent.com/proxy/SigP21VNrtU8wGuDP9FZmRmtGjbUyAFSEJnLTO_0C66Moks0EBwRKl6Xwg4VStcl9gRzgjqub7FMWNxdV1Fs2Gg-J9X9HXglvAmSjSHBiU87l8r9Iyctp5WYGQ',
      );
    } else if (endLocation === 'ESE') {
      setEndLocationImage(
        'https://www.ipvc.pt/ese/wp-content/uploads/sites/4/2021/01/ESE-10-800x600.png',
      );
    } else if (endLocation === 'ESA') {
      setEndLocationImage(
        'https://www.ipvc.pt/esa/wp-content/uploads/sites/2/2021/01/ESA-9-380x290.png',
      );
    } else if (endLocation === 'ESS') {
      setEndLocationImage(
        'https://www.ipvc.pt/ess/wp-content/uploads/sites/6/2021/01/ESS-10-380x290.png',
      );
    } else if (endLocation === 'ESDL') {
      setEndLocationImage(
        'https://www.ipvc.pt/esdl/wp-content/uploads/sites/7/2021/01/escola_melgaco_jose_campos_137-800x600.jpg',
      );
    } else if (endLocation === 'ESCE') {
      setEndLocationImage(
        'https://www.ipvc.pt/esce/wp-content/uploads/sites/5/2021/01/esce1-800x600.png',
      );
    } else if (endLocation === 'SAS') {
      setEndLocationImage(
        'https://lh3.googleusercontent.com/proxy/7kOVUx9dTGAwGWR32MecJLd3-G8QNSQF-4d_Oh1JhtPdHz2aQTSrBn_4tQ7YVYLxDtqvqSo_uUZKZV2QS1fgCy_Vg7a2w4Ue0NpO6smbPQ',
      );
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
          source={{uri: endLocationImage}}
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserProfile', {
                user: user,
              })
            }>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.shadow}>
                <Image
                  source={{uri: user.photoUrl}}
                  resizeMode="cover"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 15,
                  }}
                />
              </View>

              <View
                style={{
                  marginHorizontal: SIZES.radius,
                  justifyContent: 'space-around',
                }}>
                <Text style={{...SIZES.h3}}>{user.name}</Text>

                <StarReview rate={user.rating} />
                <View style={{marginTop: 5}}>
                  <Text style={{color: COLORS.primary}}>{user.email}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
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
        {/* Icons */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZES.base,
            justifyContent: 'space-between',
          }}>
          <ScrollView horizontal>
            <IconLabel
              icon={icons.graduationHat}
              label={`${routeInfo.startLocation}`}
            />
            <IconLabel
              icon={icons.frontCar}
              label={`${routeInfo.estimatedTime} Minutes`}
            />
            <IconLabel icon={icons.end} label={routeInfo.endLocation} />
          </ScrollView>
        </View>

        <View style={{marginTop: 10, paddingHorizontal: SIZES.padding}}>
          <Text style={{...SIZES.body2, fontWeight: '700'}}>
            Start Date: {Moment(data.startDate).format('LLL')}
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
            paddingHorizontal: SIZES.padding,
          }}>
          <Text style={{...SIZES.body2, fontWeight: '700'}}>
            Available Seats: {routeInfo.capacity}
          </Text>
        </View>

        <View
          style={{
            marginTop: SIZES.padding - 10,
            paddingHorizontal: SIZES.padding,
          }}>
          <Text style={{...SIZES.h2, fontWeight: '700'}}>Description</Text>
          <ScrollView style={{marginBottom: 140}}>
            <Text
              style={{
                marginTop: SIZES.radius,
                color: COLORS.gray,
                ...SIZES.body3,
              }}>
              {routeInfo.description}
            </Text>
          </ScrollView>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Rating
              showRating
              onFinishRating={value => setUserRating(value)}
              style={{paddingVertical: 10}}
            />
            <View style={{flexDirection: 'row', margin: 10}}>
              <Button
                title="Cancel"
                type="outline"
                style={{marginRight: 10}}
                onPress={() => setModalVisible(!modalVisible)}
              />
              <Button
                style={{marginLeft: 10, backgroundColor: COLORS.primary}}
                iconRight
                title="Rate"
                onPress={() => rateUser()}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* Footer */}
      <View
        style={{
          flex: 0.5,
          alignContent: 'center',
          alignItems: 'center',
        }}>
        {rating ? (
          <TouchableOpacity
            style={{
              width: 160,
              height: '70%',
              marginHorizontal: SIZES.radius,
            }}
            onPress={() => setModalVisible(!modalVisible)}>
            <LinearGradient
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                },
              ]}
              colors={['#D1D100', '#757500']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={{color: COLORS.white, ...SIZES.h2}}>Rate User</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
        {cancelRequest ? (
          <TouchableOpacity
            style={{
              width: 160,
              marginBottom: 20,
              height: '70%',
            }}
            onPress={() => {
              cancelledOrder();
            }}>
            <LinearGradient
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                },
              ]}
              colors={[COLORS.black, 'red']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={{color: COLORS.white, ...SIZES.h2}}>
                Cancel Request
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
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
    backgroundColor: COLORS.white,
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

export default OrderDetail;
