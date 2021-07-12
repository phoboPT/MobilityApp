/*eslint-disable*/
import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  View,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {images, icons, SIZES, COLORS} from '../constants';
import api from '../services/api';
import {FlatGrid} from 'react-native-super-grid';
import {Avatar} from 'react-native-elements';
import Moment from 'moment';
import {SectionGrid} from 'react-native-super-grid';

const OrdersScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState(null);
  const [myRoutes, setMyRoutes] = useState(null);
  const {data} = route.params;

  useEffect(() => {
    async function getRequests() {
      console.log(data.id);
      try {
        const response = await api.get('/orders/routeId/' + data.id);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    getRequests();
  }, []);

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
            Requests
          </Text>
        </View>
      </View>
    );
  }

  function renderRequests() {
    return (
      <SectionGrid
        itemDimension={90}
        // staticDimension={300}
        // fixed
        // spacing={20}
        sections={[
          {
            title: 'Received',
            data: myRoutes,
            color: '#2ecc71',
          },
          {
            title: 'Sent',
            data: myRoutes,
            color: '#f1c40f',
          },
        ]}
        style={styles.gridView}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DestinationDetail', {
                data: item,
              })
            }>
            <View style={[styles.itemContainer, {backgroundColor: 'white'}]}>
              <View>
                <Text style={styles.itemName}>Start: {item.startLocation}</Text>
                <Text style={styles.itemName}>End: {item.endLocation}</Text>
                <Text style={styles.itemDate}>
                  {Moment(item.startDate).format('lll')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({section}) => (
          <Text
            style={{
              flex: 1,
              fontSize: 20,
              fontWeight: '600',
              alignContent: 'center',
              alignItems: 'center',
              height: 50,
              color: 'white',
              padding: 12,
              backgroundColor: section.color,
            }}>
            {section.title}
          </Text>
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
          null
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
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 25,
    padding: 10,
    height: 100,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemDate: {
    fontSize: 13,
    fontWeight: '600',
  },
  userName: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: '800',
  },
  itemCode: {
    fontWeight: '500',
    fontSize: 12,
    opacity: 0.99,
  },
});
