import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {View} from 'react-native';
import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';

export default class Map extends Component {
  state = {
    region: null,
    userLocation: null,
  };
  async componentDidMount() {
    Geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => {
        console.log(latitude, longitude);
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          userLocation: {
            latitude,
            longitude,
          },
        });
      }, // sucesso
      ({error}) => {
        console.log(error);
      }, // erro
      {
        timeout: 3000,
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  }
  render() {
    const {region, userLocation} = this.state;
    console.log(region);
    return (
      <View style={{flex: 1}}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          region={region}
          showsMyLocationButton
          showUserLocation={true}
          loadingEnabled>
          <Marker coordinate={userLocation}></Marker>
        </MapView>
      </View>
    );
  }
}
