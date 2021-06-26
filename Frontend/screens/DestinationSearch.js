/*eslint-disable*/
import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {images, icons, SIZES} from '../constants';

const DestinationSearch = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const {name, title} = route.params; 

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
          <Text style={{
            fontWeight: "600"
          }}>{name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Open Filters")}
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

  return (
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
      <SafeAreaView style={styles.container}>{renderHeader()}</SafeAreaView>
    </ImageBackground>
  );
};

export default DestinationSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
