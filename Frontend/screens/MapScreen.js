import React, {useState, useEffect} from 'react';
import {
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
  Polyline,
  ActivityIndicator,
  View,
  ImageBackground,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE, Geojson} from 'react-native-maps';
import {images, icons, COLORS, SIZES} from '../constants';
import {Icon} from 'react-native-elements';
import {Alert} from 'react-native';

let lat;
let lng;

const MapScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [haveUserLocation, setHaveUserLocation] = useState(false);
  const [localizacao, setLocalizacao] = useState(true);
  const [GeoJson, setGeoJson] = useState(null);
  const [route, setRoute] = useState(null);

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
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
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
      'https://raw.githubusercontent.com/phoboPT/MobilityApp/development/ipvc-bus-routes/Bus1-Manha.geojson?token=AOEFRDVVSRJDOSPZLVJVSBLA5BELK',
    )
      .then(response => response.json())
      .then(json => {
        if (json !== null) {
          setGeoJson(json);
          setRoute(json.features[0].geometry);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    findCoordinates();
    getBusRoute();
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
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      region={initialPosition}
      showsUserLocation
      onMarkerPress={e => onMarkerPress(e)}
      onUserLocationChange={event => userLocationChanged(event)}
      onRegionChangeComplete={event => changeRegion(event)}>
      <Geojson
        geojson={GeoJson}
        strokeWidth={2}
        fillColor="green"
        strokeColor="green"
      />
    </MapView>
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
