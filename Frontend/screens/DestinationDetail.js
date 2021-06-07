import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
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

const IconLabel = ({icon, label}) => {
  return (
    <View style={{alignItems: 'center', marginLeft: 30}}>
      <Image
        source={icon}
        resizeMode="cover"
        style={{
          tintColor: COLORS.primary,
          width: 45,
          height: 45,
        }}
      />
      <Text style={{marginTop: SIZES.padding, color: COLORS.gray, ...SIZES.h3}}>
        {label}
      </Text>
    </View>
  );
};

const DestinationDetail = ({navigation}) => {
  // Render

  const data = {
    id: '1',
    title: 'Boleia até Serviços Académicos',
    description:
      'Boleia com partida na IPVC-ESTG por favor enviem me mensagem para o whatsapp para combinarmos melhor',
    contact: '+351 911979115',
    startLocation: 'IPVC-ESTG',
    userLocation: 'Viana do Castelo',
    endLocation: 'Serviços Académicos',
    estimatedTime: '10 Minutos',
    startDate: faker.date.soon().toLocaleDateString(),
    userImage: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    userName: faker.name.findName(),
    userRating: 3.5,
    price: 3,
    vehicleImage:
      'https://auto-drive.pt/wp-content/uploads/2020/05/audi-rs6-avant-by-wheelsandmore.jpg',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{flex: 2}}>
        <Image
          source={{uri: data.vehicleImage}}
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
                source={{uri: data.userImage}}
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
              <Text style={{...SIZES.h3}}>{data.userName}</Text>
              <Text style={{color: COLORS.gray, ...SIZES.body3}}>
                {data.userLocation}
              </Text>

              <StarReview rate={data.userRating} />
              <View style={{marginTop: 5}}>
                <Text style={{color: COLORS.primary}}>{data.contact}</Text>
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
        {/* Icons */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZES.base,
            justifyContent: 'space-between',
          }}>
          <ScrollView horizontal>
            <IconLabel icon={icons.frontCar} label={data.startLocation} />
            <IconLabel icon={icons.rightArrow} label={data.estimatedTime} />
            <IconLabel icon={icons.end} label={data.endLocation} />
          </ScrollView>
        </View>

        {/* About */}
        <View style={{marginTop: 10, paddingHorizontal: SIZES.padding}}>
          <Text style={{...SIZES.body2}}>Start Date: {data.startDate}</Text>
        </View>

        {/* About */}
        <View
          style={{
            marginTop: SIZES.padding - 10,
            paddingHorizontal: SIZES.padding,
          }}>
          <Text style={{...SIZES.h2}}>Description</Text>
          <ScrollView style={{marginBottom: 140}}>
            <Text
              style={{
                marginTop: SIZES.radius,
                color: COLORS.gray,
                ...SIZES.body3,
              }}>
              {data.description}
            </Text>
          </ScrollView>
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          flex: 0.5,
          marginLeft: 50,
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            width: 130,
            marginBottom: 20,
            height: '50%',
            marginHorizontal: SIZES.radius,
          }}
          onPress={() => {
            navigation.navigate('Map');
          }}>
          <LinearGradient
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              },
            ]}
            colors={['#D1D100', '#757500']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={{color: COLORS.white, ...SIZES.h2}}>Show Route</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 130,
            marginBottom: 20,
            height: '50%',
          }}
          onPress={() => {
            console.log('Booking on pressed');
          }}>
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
            <Text style={{color: COLORS.white, ...SIZES.h2}}>
              GO {data.price}$
            </Text>
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

export default DestinationDetail;
