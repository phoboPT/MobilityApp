import React, {Component} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default class Search extends Component {
  state = {
    searchFocused: false,
  };

  render() {
    const {searchFocused} = this.state;
    const {onLocationSelected} = this.props;
    
    return (
      <GooglePlacesAutocomplete
        placeholder="Where you want to go?"
        placeholderTextColor="#333"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(details.geometry.location);
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
            position: 'absolute',
            zIndex: -10,
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
