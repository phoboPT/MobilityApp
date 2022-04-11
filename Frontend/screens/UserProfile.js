import React, {useState, useEffect} from 'react';

import StarRating from 'react-native-star-rating';
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
import {images, icons, COLORS, SIZES} from '../constants';
import {ScrollView} from 'react-native';

const UserProfile = ({navigation, route}) => {
  const {user} = route.params;
  const [rating, setRating] = useState(null);

  const onStarRatingPress = score => {
    setRating(score);
  };

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
              <Image
                source={{uri: user.photoUrl}}
                resizeMode="cover"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 15,
                }}
              />
            </View>

            <View
              style={{
                marginHorizontal: SIZES.radius,
                justifyContent: 'space-around',
              }}>
              <Text style={{...SIZES.h3}}>{user.name}</Text>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                selectedStar={score => onStarRatingPress(score)}
              />
              <View style={{marginTop: 5}}>
                <Text style={{color: COLORS.primary}}>{user.email}</Text>
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
          <View style={{flex: 1, alignItems: 'flex-end'}} />
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
