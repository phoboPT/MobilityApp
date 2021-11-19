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
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {images, icons, SIZES, COLORS} from '../constants';
import api from '../services/api';
import {FlatGrid} from 'react-native-super-grid';
import Moment from 'moment';
import {company} from 'faker';

const DestinationSearch = ({route, navigation}) => {
  const [loading, setLoading] = useState(true);
  const {name, endLocation, startLocation} = route.params;
  const [routes, setRoutes] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [routesList, setRoutesList] = useState([]);
  useEffect(() => {
    // temail@testdefff.com
    async function getRoutes() {
      setLoading(true);
      try {
        const response = await api.get(
          '/routes/start/' + startLocation + '/end/' + endLocation,
        );
        filterRoutes(response.data);
      } catch (err) {
        console.log(err);
        Alert.alert('Error! Please try again later!');
        setLoading(false);
      }
    }
    getRoutes();
  }, []);

  const getRouteDetails = route => {
    const allData = route;
    navigation.navigate('DestinationDetail', {
      data: route[0],
      allData: allData,
      endLocation: endLocation,
    });
  };

  const filterRoutes = routes => {
    if (routes.length == 0) {
      setRoutes([]);
      Alert.alert('No Routes Available');
    } else {
      routes.forEach(element => {
        setRoutesList(oldArray => [...oldArray, element]);
      });
    }
    setLoading(false);
  };
  const openFilter = () => {
    console.log('Open Filters');
  };

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
              fontWeight: '600',
            }}>
            {name}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => openFilter()}
          style={{
            marginLeft: 10,
            width: 50,
            paddingRight: SIZES.padding * 1,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.filter}
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

  function renderRouteOptions() {
    return (
      <FlatGrid
        itemDimension={130}
        data={routesList}
        style={styles.gridView}
        spacing={10}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => getRouteDetails(item)}>
            <View style={[styles.itemContainer, {backgroundColor: 'white'}]}>
              <View>
                <Text style={styles.itemName}>Start: {startLocation}</Text>
                <Text style={styles.itemName}>End: {endLocation}</Text>
                <Text style={styles.itemName}>
                  Estimated Time: {item[0].estimatedTime} Minutes
                </Text>
                <Text style={styles.itemDate}>
                  {Moment(item.startDate).format('lll')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
          renderRouteOptions()
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DestinationSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 25,
    padding: 10,
    height: 150,
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
