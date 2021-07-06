import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import faker from 'faker';
import {images, icons, COLORS, SIZES} from '../constants';
import {ScrollView} from 'react-native';

const StarReview = ({rate}) => {
  var starComponents = [];
  var fullStar = Math.floor(rate);
  var noStar = Math.floor(5 - rate);
  var halfStar = 5 - fullStar - noStar;

  // Full Star
  for (var i = 0; i < fullStar; i++) {
    starComponents.push(
      <Image
        key={`full-${i}`}
        source={icons.starFull}
        resizeMode="cover"
        style={{
          width: 20,
          height: 20,
        }}
      />,
    );
  }

  // Half Star
  for (var i = 0; i < halfStar; i++) {
    starComponents.push(
      <Image
        key={`half-${i}`}
        source={icons.starHalf}
        resizeMode="cover"
        style={{
          width: 20,
          height: 20,
        }}
      />,
    );
  }

  // No Star
  for (var i = 0; i < noStar; i++) {
    starComponents.push(
      <Image
        key={`empty-${i}`}
        source={icons.starEmpty}
        resizeMode="cover"
        style={{
          width: 20,
          height: 20,
        }}
      />,
    );
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {starComponents}
      <Text
        style={{marginLeft: SIZES.base, color: COLORS.gray, ...SIZES.body3}}>
        {rate}
      </Text>
    </View>
  );
};

const UserProfile = ({navigation, route}) => {
  const {user} = route.params;

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{flex: 2}}>
        <Image
          source={images.background}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '80%',
          }}
        />
        <View
          style={[
            {
              position: 'absolute',
              bottom: '5%',
              left: '5%',
              right: '5%',
              borderRadius: 15,
              padding: SIZES.padding,
              backgroundColor: COLORS.white,
            },
            styles.shadow,
          ]}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.shadow}>
              {user.urlPhoto ? (
                <Image
                  source={{uri: user.urlPhoto}}
                  resizeMode="cover"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 15,
                  }}
                />
              ) : (
                <Image
                  source={images.defaultUser}
                  resizeMode="cover"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 15,
                  }}
                />
              )}
            </View>

            <View
              style={{
                marginHorizontal: SIZES.radius,
                justifyContent: 'space-around',
              }}>
              <Text style={{...SIZES.h3}}>{user.name}</Text>
              <StarReview rate={user.rating} />
              <View style={{marginTop: 5}}>
                <Text style={{color: COLORS.primary}}>{user.contact}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Header Buttons */}
        <View
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            right: 20,
            //height: 50,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                source={icons.back}
                resizeMode="cover"
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}></View>
        </View>
      </View>
      {/* Body */}
      <View style={{flex: 1.5}}>
        <View
          style={{
            marginTop: SIZES.padding - 10,
            paddingHorizontal: SIZES.padding,
          }}>
          <Text style={{...SIZES.h2}}>Biography</Text>
          <ScrollView style={{marginBottom: 140}}>
            <Text
              style={{
                marginTop: SIZES.radius,
                color: COLORS.gray,
                ...SIZES.body3,
              }}>
              {user.biography}
            </Text>
          </ScrollView>
        </View>
      </View>
      {/* Footer */}
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <TouchableOpacity
          style={{
            width: 200,
            marginBottom: 20,
            height: '30%',
          }}
          onPress={() =>
            navigation.navigate('SingleMessage', {
              user: user,
              name: user.name,
            })
          }>
          <LinearGradient
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              },
            ]}
            colors={[COLORS.primary, '#5884ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginTop: 3,
                  marginRight: 15,
                  color: COLORS.white,
                  ...SIZES.h2,
                }}>
                Send Message
              </Text>
              <Image
                style={{width: 25, height: 25, tintColor: COLORS.white}}
                source={icons.send}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default UserProfile;
