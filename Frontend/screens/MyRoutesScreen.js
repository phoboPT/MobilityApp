/*eslint-disable*/
import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  Text,
  Button,
  TouchableOpacity,
  Animated,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {images, icons, SIZES} from '../constants';
import faker from 'faker';
import {Alert} from 'react-native';

faker.seed(10);
const DATA = [...Array(5).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    name: faker.name.findName(),
    requestName: faker.name.jobTitle(),
  };
});

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const MyRoutesScreen = ({navigation}) => {
  const scrollY = new Animated.Value(0);
  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
            marginRight: 5,
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
            borderRadius: 20,
            width: 280,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
            }}>
            Simba
          </Text>
        </View>
      </View>
    );
  }

  function recommendationsNearMe() {
    return (
      <View>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 24,
            marginTop: 10,
            fontFamily: 'Arial',
            color: 'white',
            fontWeight: '400',
          }}>
          Requests
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Animated.FlatList
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}
            data={DATA}
            contentContainerStyle={{padding: SPACING}}
            keyExtractor={item => item.key}
            renderItem={({item, index}) => {
              const inputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 2),
              ];

              const opacityInputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 2),
              ];

              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0],
              });

              const opacity = scrollY.interpolate({
                inputRange: opacityInputRange,
                outputRange: [1, 1, 1, 0],
              });
              return (
                <Animated.View
                  style={{
                    flexDirection: 'row',
                    padding: SPACING,
                    marginBottom: SPACING,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 10,
                    },
                    shadowOpacity: 1,
                    opacity,
                    transform: [{scale}],
                    shadowRadius: 15,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }}>
                  <Image
                    source={{uri: item.image}}
                    style={{
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                      borderRadius: AVATAR_SIZE,
                      marginRight: SPACING / 2,
                    }}
                  />
                  <View
                    style={{
                      marginRight: 1,
                    }}>
                    <Text style={{fontSize: 22, fontWeight: '500'}}>
                      {item.name}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '300'}}>
                      {item.requestName}
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <TouchableOpacity onPress={() => Alert.alert('Accept')}>
                        <Image
                          source={images.accept}
                          style={{
                            width: 42,
                            height: 42,
                            marginRight: 10,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => Alert.alert('Decline')}>
                        <Image
                          source={images.decline}
                          style={{
                            width: 42,
                            height: 42,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              );
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {recommendationsNearMe()}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MyRoutesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
