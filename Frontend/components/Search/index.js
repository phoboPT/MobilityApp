import React, {Component} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import * as RootNavigation from '../../navigation/RootNavigation';

export default class Search extends Component {
  state = {
    searchFocused: false,
    endLocation: null,
  };

  render() {
    const {searchFocused} = this.state;

    const goToMap = (data, details) => {
      this.setState({
        endLocation: {
          city: data,
          latitude: details.lat,
          longitude: details.lng,
        },
      });
      RootNavigation.navigate('Map', {endLocation: this.state.endLocation});
    };

    return (
      <GooglePlacesAutocomplete
        placeholder="Where you want to go?"
        placeholderTextColor="#333"
        onPress={(data, details = null) => {
          goToMap(data.description, details.geometry.location);
        }}
        query={{
          key: 'AIzaSyBdWzj4T_9wAemIcvPfIONYBTMi4c8u13k',
          language: 'pt',
        }}
        textInputProps={{
          onFocus: () => {
            this.setState({searchFocused: true});
          },
          onBlur: () => {
            this.setState({searchFocused: false});
          },
          autoCapitalize: 'none',
          autoCorrect: false,
        }}
        listViewDisplayed={searchFocused}
        fetchDetails
        enablePoweredByContainer={false}
        styles={{
          container: {
            position: 'absolute',
            width: '100%',
          },
          textInputContainer: {
            flex: 1,
            backgroundColor: 'transparent',
            height: 54,
            marginHorizontal: 20,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            height: 54,
            margin: 0,
            borderRadius: 12,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
            marginLeft: 0,
            marginRight: 0,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: {x: 0, y: 0},
            shadowRadius: 15,
            borderWidth: 1,
            borderColor: '#DDD',
            fontSize: 15,
          },
          listView: {
            position: 'relative',
            borderWidth: 1,
            borderColor: '#DDD',
            backgroundColor: '#FFF',
            marginHorizontal: 20,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: {x: 0, y: 0},
            shadowRadius: 15,
            top: 50,
          },
          description: {
            fontSize: 16,
          },
          row: {
            padding: 10,
            height: 56,
          },
        }}
      />
    );
  }
}
