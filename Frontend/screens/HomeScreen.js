import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {icons, COLORS, SIZES, images} from '../constants/index';
import ActionButton from 'react-native-action-button';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from '@react-native-community/geolocation';
import {FlatGrid} from 'react-native-super-grid';
import api from '../services/api';
import Moment from 'moment';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = ({navigation}) => {
  const [hasNextRide, setHasNextRide] = useState(false);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [startLocation, setStartLocation] = React.useState('');
  const [endLocation, setEndLocation] = React.useState('');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [nextTravel, setNextTravel] = useState(null);
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);

  const [items, setItems] = useState([
    {
      label: 'Escola Superior de Tecnologia e Gestão',
      value: 'ESTG',
      position: {
        lat: 41.693463,
        long: -8.846654,
      },
    },
    {
      label: 'Escola Superior de Educação',
      value: 'ESE',
      position: {
        lat: 41.702491,
        long: -8.820698,
      },
    },
    {
      label: 'Escola Superior Agrária',
      value: 'ESA',
      position: {
        lat: 41.793549,
        long: -8.54277,
      },
    },
    {
      label: 'Escola Superior de Saúde',
      value: 'ESS',
      position: {
        lat: 41.697553,
        long: -8.836266,
      },
    },
    {
      label: 'Escola Superior de Desporto e Lazer',
      value: 'ESDL',
      position: {
        lat: 42.117427,
        long: -8.271185,
      },
    },
    {
      label: 'Escola Superior de Ciências Empresariais',
      value: 'ESCE',
      position: {
        lat: 42.031629,
        long: -8.632825,
      },
    },
    {
      label: 'Serviços Académicos',
      value: 'SAS',
      position: {
        lat: 41.693286,
        long: -8.832566,
      },
    },
  ]);

  function recommendationsNearMe() {
    console.log(recommendations);
    return (
      <>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 24,
            fontFamily: 'Arial',
            color: 'white',
            position: 'relative',
            fontWeight: '400',
          }}>
          Recomendations
        </Text>

        <FlatGrid
          itemDimension={130}
          data={recommendations}
          style={styles.gridView}
          spacing={15}
          renderItem={({item}) => {
            console.log('item', item);
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DestinationDetail', {
                    data: item,
                    allData: null,
                    endLocation: item.endLocation,
                  })
                }>
                <View
                  style={[styles.itemContainer, {backgroundColor: 'white'}]}>
                  <View>
                    <Text style={styles.itemName}>
                      Start: {item.startLocation}
                    </Text>
                    <Text style={styles.itemName}>End: {item.endLocation}</Text>
                    <Text style={styles.itemDate}>
                      {Moment(item.startDate).format('lll')}
                    </Text>
                    <Text style={styles.itemCode}>
                      Estimated Time: {item.estimatedTime} Minutes
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </>
    );
  }

  useEffect(() => {
    async function handleUserNextScreen() {
      const id = await AsyncStorage.getItem('@App:userID');
      setUserId(id);
    }
    handleUserNextScreen();
    findCoordinates();
  }, []);

  const searchRoutes = () => {
    if (startLocation == endLocation) {
      Alert.alert(
        'Start Location and End Location are the same! Please change!',
      );
    } else {
      const nameLocation = items.filter(obj => {
        return obj.value === endLocation;
      });
      navigation.navigate('DestinationSearch', {
        startLocation: startLocation,
        endLocation: endLocation,
        name: nameLocation[0].label,
      });
    }
  };
  const findCoordinates = async () => {
    Geolocation.getCurrentPosition(
      position => {
        const lat = JSON.stringify(position.coords.latitude);
        const lng = JSON.stringify(position.coords.longitude);

        const myLocation = {
          position: {
            lat: lat,
            lng: lng,
          },
        };

        nearestLocation(myLocation);
      },
      error => {
        console.log('error: ', error);
        getMyNextTravel();
      },
      {enableHighAccuracy: false, timeout: 36000, maximumAge: 1000},
    );
  };

  // Calculate distance from my location to all the 6 locations and get the nearest
  // It uses haversine formula
  /*
  φ is latitude, λ is longitude, R is earth’s radius (mean radius = 6,371km);
  note that angles need to be in radians to pass to trig functions!
  */
  function nearestLocation(myLocation) {
    const R = 6371e3; // metres
    const startLocations = [];
    for (let i = 0; i < items.length; i++) {
      const φ1 = (myLocation.position.lat * Math.PI) / 180; // φ, λ in radians
      const φ2 = (items[i].position.long * Math.PI) / 180;
      const Δφ =
        ((items[i].position.lat - myLocation.position.lat) * Math.PI) / 180;
      const Δλ =
        ((items[i].position.long - myLocation.position.lng) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const d = R * c; // in metres

      startLocations.push({distance: d, startLocation: items[i].value});
    }

    const startLocation = startLocations.reduce(function (prev, curr) {
      return prev.distance < curr.distance ? prev : curr;
    });
    getRecommendations(startLocation.startLocation);
    getMyNextTravel();
  }

  // A função serve para receber as recomendacoes pelo simples pedido da procura de boleias que
  // se inciam no local onde estamos mais perto
  // o forEach serve unicamente para nao mostrar boleias criadas por nos
  async function getRecommendations(startLocation) {
    const recommendations = [];
    try {
      const response = await api.get('/routes/startLocation/' + startLocation);
      if (response.data.length !== 0) {
        response.data.forEach(element => {
          if (element.userId !== JSON.parse(userId)) {
            recommendations.push(element);
          }
        });
      }
      if (recommendations.length != 0) {
        setRecommendations(recommendations);
        setHasRecommendations(true);
      }
      getMyNextTravel();
    } catch (err) {
      getMyNextTravel();
      console.log(err);
    }
  }

  async function getMyNextTravel() {
    try {
      const response = await api.get('/routes/user');
      if (response.data.lenght !== undefined) {
        setHasNextRide(true);
        setNextTravel(response.data);
      } else {
        setHasNextRide(false);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  function renderMyNextTravel() {
    return (
      <View>
        <DropDownPicker
          open={open}
          closeAfterSelecting={true}
          itemSeparator={true}
          value={value}
          itemKey="label"
          theme="DARK"
          schema={{
            label: 'label',
            value: 'value',
          }}
          items={items}
          onChangeValue={() => {
            const item = items.filter(obj => {
              return obj.value === value;
            });
            navigation.navigate('DestinationSearch', {
              endLocation: item[0].value,
              name: item[0].label,
            });
          }}
          placeholder="Where you want to go?"
          setOpen={setOpen}
          setValue={setValue}
          containerStyle={{
            flex: 1,
            width: 330,
            marginTop: 40,
            marginBottom: 10,
            marginLeft: 30,
            marginRight: 30,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          searchTextInputStyle={{
            borderRadius: 30,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <Text
          style={{
            marginLeft: 15,
            fontSize: 24,
            fontFamily: 'Arial',
            color: 'white',
            position: 'relative',
            fontWeight: '400',
            marginTop: 30,
          }}>
          Your next travel
        </Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <FlatGrid
            data={nextTravel}
            horizontal
            style={{alignSelf: 'center', marginLeft: 15}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() =>
                  navigation.navigate('DestinationDetail', {
                    data: item,
                    allData: null,
                    endLocation: item.endLocation,
                  })
                }>
                <View
                  style={[
                    styles.nextTravelContainer,
                    {backgroundColor: 'white', marginRight: 10},
                  ]}>
                  <View>
                    <Text style={styles.itemName}>
                      Start: {item.startLocation}
                    </Text>
                    <Text style={styles.itemDate}>
                      {Moment(item.startDate).format('lll')}
                    </Text>
                    <Text style={styles.itemCode}>
                      Estimated Time: {item.estimatedTime} Minutes
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.nextTravelContainer,
                    {backgroundColor: 'white', marginLeft: 10},
                  ]}>
                  <View
                    style={{
                      flexDirection: 'column',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text style={{fontWeight: '400', fontSize: 20}}>End</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: '700', fontSize: 25}}>
                        {item.endLocation}
                      </Text>
                      <Image
                        source={icons.end}
                        style={{
                          marginLeft: 5,
                          marginTop: 2,
                          width: 23,
                          height: 23,
                          tintColor: COLORS.primary,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }

  function renderDestinations() {
    return (
      <View>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 24,
            fontFamily: 'Arial',
            color: 'white',
            position: 'relative',
            fontWeight: '400',
          }}>
          Search Routes
        </Text>
        <View style={{alignContent: 'center', alignItems: 'center'}}>
          <DropDownPicker
            open={open}
            closeAfterSelecting={true}
            itemSeparator={true}
            value={value}
            itemKey="label"
            theme="DARK"
            schema={{
              label: 'label',
              value: 'value',
            }}
            items={items}
            placeholder="Start Location"
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={() => setStartLocation(value)}
            containerStyle={{
              width: '88%',
              marginBottom: 10,
              zIndex: 2,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 10,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            searchTextInputStyle={{
              borderRadius: 30,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <DropDownPicker
            open={open1}
            closeAfterSelecting={true}
            itemSeparator={true}
            value={value1}
            itemKey="label"
            theme="DARK"
            schema={{
              label: 'label',
              value: 'value',
            }}
            items={items}
            placeholder="End Location"
            onChangeValue={() => setEndLocation(value1)}
            setOpen={setOpen1}
            setValue={setValue1}
            containerStyle={{
              width: '88%',
              marginBottom: 10,
              zIndex: 1,
              marginLeft: 30,
              marginRight: 30,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            searchTextInputStyle={{
              borderRadius: 30,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <Button
            iconRight
            onPress={() => searchRoutes()}
            containerStyle={{
              borderRadius: 30,
              marginTop: 10,
              marginBottom: 10,
              width: 150,
            }}
            icon={
              <Image
                source={icons.search}
                style={{
                  marginLeft: 5,
                  width: 30,
                  height: 30,
                  tintColor: 'white',
                }}
              />
            }
            title="Search"
          />
        </View>
      </View>
    );
  }
  function renderBody() {
    return (
      <View>
        {hasNextRide ? renderMyNextTravel() : renderDestinations()}
        {hasRecommendations ? recommendationsNearMe() : null}
      </View>
    );
  }

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.menu}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 24, fontWeight: '400'}}>Home</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Messages')}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.send}
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

  function renderActionButton() {
    return (
      <ActionButton
        buttonColor={COLORS.primary}
        onPress={() => navigation.navigate('CreateCarPooling')}
      />
    );
  }

  if (loading) {
    return (
      <ImageBackground
        style={{flex: 1, resizeMode: 'cover'}}
        source={images.background}>
        {renderHeader()}
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
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
      <SafeAreaView style={{flex: 1}}>
        {renderHeader()}
        {renderBody()}
        {renderActionButton()}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gridView: {
    zIndex: 0,
    marginTop: 5,
  },
  nextTravelContainer: {
    justifyContent: 'flex-start',
    borderRadius: 15,
    width: 170,
    padding: 20,
    height: 100,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 15,
    padding: 10,
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
