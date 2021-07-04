import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Text,
  Polyline,
  ActivityIndicator,
  View,
  ImageBackground,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE, Geojson} from 'react-native-maps';
import {images, icons, COLORS, SIZES} from '../constants';

let lat;
let lng;

const MapScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [haveUserLocation, setHaveUserLocation] = useState(false);
  const [GeoJsonBus, setGeoJsonBus] = useState(null);
  const [GeoJsonCar, setGeoJsonCar] = useState(null);
  const {mapType, startLocation, endLocation} = route.params;
  const {region, setRegion} = useState([]);
  const [endLocationDescription, setEndLocationDescription] = useState({
    name: endLocation,
    latitude: null,
    longitude: null,
  });

  const [startLocationDescription, setStartLocationDescription] = useState({
    name: startLocation,
    latitude: null,
    longitude: null,
  });

  const [initialPosition, setInitialPosition] = useState({
    latitude: 41.6946,
    longitude: -8.83016,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const findCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        lat1 = JSON.stringify(position.coords.latitude);
        lng1 = JSON.stringify(position.coords.longitude);
        lat = lat1;
        lng = lng1;
        if (lat !== undefined) {
          setInitialPosition({
            latitude: Number(lat),
            longitude: Number(lng),
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          });
          setHaveUserLocation(true);
        }
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 1000, maximumAge: 1000},
    );
  };

  const getBusRoute = () => {
    return fetch(
      'https://raw.githubusercontent.com/phoboPT/MobilityApp/development/mobility-one-routes/BUS/BUS1.geojson',
    )
      .then(response => response.json())
      .then(json => {
        if (json !== null) {
          setGeoJsonBus(json);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getCarRoute = () => {
    return fetch(
      'https://raw.githubusercontent.com/phoboPT/MobilityApp/development/mobility-one-routes/' +
        startLocation +
        '/' +
        endLocation +
        '.geojson',
    )
      .then(response => response.json())
      .then(json => {
        if (json !== null) {
          setGeoJsonCar(json);
          setEndLocationDescription({
            name: json.features[2].properties.name,
            latitude: json.features[2].geometry.coordinates[1],
            longitude: json.features[2].geometry.coordinates[0],
          });
          setStartLocationDescription({
            name: json.features[1].properties.name,
            latitude: json.features[1].geometry.coordinates[1],
            longitude: json.features[1].geometry.coordinates[0],
          });
          getRegionForCoordinates(
            startLocationDescription,
            endLocationDescription,
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    findCoordinates();
    if (mapType == 'Bus') {
      getBusRoute();
    } else if (mapType == 'Car') {
      getCarRoute();
    }
  }, []);

  const userLocationChanged = event => {
    const newRegion = event.nativeEvent.coordinate;

    if (!(newRegion.latitude == lat && newRegion.longitude == lng)) {
      lat = newRegion.latitude;
      lng = newRegion.longitude;
    }
  };

  const changeRegion = event => {
    latDelta = event.latitudeDelta * 0.77426815;
    lngDelta = event.longitudeDelta * 0.77426815;
  };

  const onMarkerPress = e => {
    console.log(e.nativeEvent.coordinate);
  };

  const centrarUtl = () => {
    var initialRegion = {
      latitude: Number(lat),
      longitude: Number(lng),
      longitudeDelta: 0.01,
      latitudeDelta: 0.01,
    };

    setInitialPosition(initialRegion);
  };

  const getRegionForCoordinates = (startPoint, finishPoint) => {
    // points should be an array of { latitude: X, longitude: Y }
    const points = [];
    points.push(startPoint);
    points.push(finishPoint);
    let minX, maxX, minY, maxY;

    // init first point
    (point => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map(point => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = maxX - minX;
    const deltaY = maxY - minY;

    setLoading(false);
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={icons.back}
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            right: 20,
            width: 30,
            height: 30,
          }}
        />
      </TouchableOpacity>
    );
  };

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
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={initialPosition}
        showsUserLocation
        onMarkerPress={e => onMarkerPress(e)}
        onUserLocationChange={event => userLocationChanged(event)}
        onRegionChangeComplete={event => changeRegion(event)}>
        {renderHeader()}
        <Geojson
          geojson={GeoJsonCar}
          strokeWidth={4}
          fillColor="black"
          strokeColor="black"
        />
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
