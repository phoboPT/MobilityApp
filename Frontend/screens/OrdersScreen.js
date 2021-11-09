/*eslint-disable*/
import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {images, icons, SIZES, COLORS} from '../constants';
import api from '../services/api';
import {FlatGrid} from 'react-native-super-grid';
import {Avatar} from 'react-native-elements';
import {Alert} from 'react-native';

const OrdersScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState([]);
  const {data} = route.params;

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    setLoading(true);
    try {
      const response = await api.get('/orders/routeId/' + data.id);
      setOrders(response.data);
      getUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  function getUsers(data) {
    var i = 0;
    for (i = 0; i < data.length; i++) {
      getUserInfo(data[i].userId);
    }
  }

  async function endRoute() {
    try {
      const response = await api.put('/routes/' + data.id);
      Alert.alert('Route finished. This will no longer be available to users');
    } catch (err) {
      console.log(err);
    }
  }

  async function getUserInfo(id) {
    try {
      const response = await api.get('/users/' + id);
      setUsers(users => [...users, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  function updateOrder(accept, userId) {
    // Nos estamos a receber o id do utilizador pois vamos realizar uma query nas orders
    // Na Flatgrid nao sabemos a order e temos que descobrila atraves do userId
    let order = orders.filter(item => item.userId === userId);
    console.log(order);
    if (accept) {
      acceptOrder(order[0]);
    } else {
      cancelledOrder(order[0]);
    }
  }

  async function acceptOrder(order) {
    try {
      const response = await api.post('/orders/accepted', {
        id: order.id,
      });
      Alert.alert('Order Accepted!');
      getOrders();
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelledOrder(order) {
    try {
      const response = await api.post('/orders/cancelled', {
        id: order.id,
      });
      Alert.alert('Order Cancelled!');
      getOrders();
    } catch (error) {
      console.log(error);
    }
  }

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            borderRadius: 20,
            width: 280,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '400',
            }}>
            Orders
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => endRoute()}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 1,
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Image
            source={icons.finish}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderOrders() {
    return (
      <FlatGrid
        data={users}
        style={styles.gridView}
        renderItem={({item}) => (
          <View style={[styles.itemContainer, {backgroundColor: 'white'}]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserProfile', {
                  user: item,
                })
              }>
              <View
                style={{
                  flexDirection: 'column',
                  alignContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Avatar
                  style={{width: 60, height: 60, marginBottom: 5}}
                  rounded={true}
                  source={{
                    uri: item.photoUrl,
                  }}
                />
                <Text style={{fontWeight: '700'}}>{item.name}</Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignSelf: 'center',
              }}>
              <TouchableOpacity onPress={() => updateOrder(true, item.id)}>
                <Avatar
                  style={{width: 50, height: 50, marginRight: 10}}
                  source={images.accept}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateOrder(false, item.id)}>
                <Avatar
                  style={{width: 50, height: 50, marginLeft: 10}}
                  source={images.decline}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  }

  return (
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="white"
            style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}
          />
        ) : (
          renderOrders()
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 10,
    height: 160,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  sectionHeader: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    alignItems: 'center',
    backgroundColor: '#636e72',
    color: 'white',
    padding: 10,
  },
});
