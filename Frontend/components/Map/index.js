import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {icons, COLORS, SIZES} from '../../constants/index';
import MapHeader from '../MapHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Map extends Component {
  state = {
    region: null,
    userLocation: null,
    endLocation: null,
    haveEndLocation: false,
    the2points: [],
  };

  async componentDidMount() {
    this.setState({endLocation: null});
    const {navigation, route} = this.props;
    if (route.params === undefined) {
      this.setState({endLocation: null});
    } else {
      this.setState({
        the2points: [...this.state.the2points, route.params.endLocation],
      });
      this.setState({endLocation: route.params.endLocation});
      this.setState({haveEndLocation: true});
    }

    Geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => {
        this.setState({
          userLocation: {
            latitude,
            longitude,
          },
          the2points: [...this.state.the2points, {latitude, longitude}],
        });
        this.getRegionForCoordinates();
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

  handleLocationSelected = (data, {geometry}) => {
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry;

    // Remove EndLocation from Array the2points to calculate the region again
    var array = [...this.state.the2points]; // make a separate copy of the array
    var index = array.indexOf(this.state.endLocation);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({the2points: array});
    }

    // Add the new EndLocation
    this.setState({
      endLocation: {
        ...this.state.endLocation,
        latitude: latitude,
        longitude: longitude,
        city: data.description,
      },
    });

    // Add the new EndLocation to the Array
    // Push Object EndLocation to the end of the array
    this.setState(prevState => ({
      the2points: [...prevState.the2points, this.state.endLocation],
    }));

    this.getRegionForCoordinates();
  };

  getRegionForCoordinates() {
    // points should be an array of { latitude: X, longitude: Y }
    const points = this.state.the2points;

    if (points.length == 1) {
      this.setState({
        region: {
          latitude: points[0].latitude,
          longitude: points[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
      });
    } else {
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

      this.setState({
        region: {
          latitude: midX,
          longitude: midY,
          latitudeDelta: deltaX * 1.25,
          longitudeDelta: deltaY * 1.25,
        },
      });
    }
  }

  removeEndLocation = () => {
    console.log(this.state.endLocation);
    this.setState({haveEndLocation: false});
    this.setState({endLocation: null});
    console.log(this.state.endLocation);
  };

  render() {
    const {region, userLocation, endLocation, haveEndLocation, the2points} =
      this.state;

    return (
      <View style={{flex: 1}}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          region={region}
          showUserLocation={true}
          loadingEnabled>
          <Marker style={{width: 24, height: 24}} coordinate={userLocation}>
            <Image
              source={icons.userMarker}
              style={{height: 35, width: 35, tintColor: 'red'}}
            />
          </Marker>
          {haveEndLocation && (
            <Marker style={{width: 20, height: 20}} coordinate={endLocation}>
              <Image source={icons.end} style={{height: 35, width: 35}} />
              <Callout tooltip onPress={this.removeEndLocation}>
                <View>
                  <View style={styles.bubble}>
                    <View
                      styles={{flexDirection: 'row', alignContent: 'center'}}>
                      <Icon
                        style={styles.callImage}
                        name="location-arrow"
                        color={COLORS.primary}
                        size={32}
                      />
                      <Text
                        style={{
                          marginTop: 10,
                          fontWeight: 'bold',
                        }}>
                        {endLocation.city}
                      </Text>
                      <Text style={{fontSize: 12}}>
                        Latitude: {endLocation.latitude}
                      </Text>
                      <Text style={{fontSize: 12}}>
                        Longitude: {endLocation.longitude}
                      </Text>
                      <Button
                        containerStyle={{
                          justifyContent: 'center',
                          alignContent: 'center',
                          width: '70%',
                          alignSelf: 'center',
                          marginTop: 10,
                          backgroundColor: COLORS.primary,
                        }}
                        iconRight
                        icon={
                          <Icon name="minus-circle" size={16} color="white" />
                        }
                        titleStyle={{fontSize: 10}}
                        title="Remove End Location   "
                      />
                    </View>
                  </View>
                </View>
              </Callout>
            </Marker>
          )}
        </MapView>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: Platform.select({ios: 60, android: 40}),
            width: '100%',
          }}>
          <TouchableOpacity
            style={{left: 10, top: 10}}
            onPress={this.props.navigation.openDrawer}>
            <Image source={icons.menu} style={{width: 32, height: 32}} />
          </TouchableOpacity>
          <MapHeader onLocationSelected={this.handleLocationSelected} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  callImage: {
    alignSelf: 'center',
    alignContent: 'flex-start',
    width: 32,
    height: 32,
  },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: wp('2%'),
    height: hp('20%'),
    width: wp('55%'),
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
