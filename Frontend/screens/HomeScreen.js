/*eslint-disable*/
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  Animated,
} from 'react-native';
import {icons, COLORS, SIZES, images} from '../constants/index';
import ActionButton from 'react-native-action-button';
import faker from 'faker';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SearchBar} from 'react-native-elements';

// PASSOS
/*
1 - Verificar se existe próxima boleia 
2 - Verificar boleia se existe boleias recomendadas a partir do meu local
*/

faker.seed(10);
const DATA = [...Array(5).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    name: faker.name.findName(),
    title: faker.random.words(),
    description: faker.random.words(),
    city: faker.address.city(),
    address: faker.address.streetAddress(),
    date: faker.date.future().toLocaleDateString(),
    vehicle: faker.vehicle.vehicle(),
    phoneNumber: faker.phone.phoneNumber(),
    time: faker.date.soon.toString(),
  };
});

const SPACING = 20;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const HomeScreen = ({navigation}) => {
  const [hasNextRide, setHasNextRide] = useState(false);
  const [search, setSearch] = useState("");

  const scrollY = new Animated.Value(0);
  const NEXT_TRAVEL_2 = [
    {
      id: 1,
      title: 'Bike',
      startTime: faker.date.soon().toLocaleDateString(),
      address: faker.address.streetAddress(),
      time: '10 Minutes',
    },
    {
      id: 2,
      title: 'Bus',
      address: faker.address.streetAddress(),
      startTime: faker.date.soon().toLocaleDateString(),
      time: '1 Hour',
    },
    {
      id: 3,
      title: 'Train',
      startTime: faker.date.soon().toLocaleDateString(),
      address: faker.address.streetAddress(),
      time: '50 m',
    },
    {
      id: 4,
      title: 'FINISH',
      startTime: faker.date.soon().toLocaleDateString(),
      address: faker.address.streetAddress(),
      time: null,
    },
  ];

  const DESTINATIONS = [
    {
      id: 1,
      title: 'ESTG',
      name: 'Escola Superior de Tecnologia e Gestão',
    },
    {
      id: 2,
      title: 'ESE',
      name: 'Escola Superior de Educação',
    },
    {
      id: 3,
      title: 'ESS',
      name: 'Escola Superior de Saúde',
    },
    {
      id: 4,
      title: 'ESDL',
      name: 'Escola Superior de Desporto e Lazer',
    },
    {
      id: 5,
      title: 'ESCE',
      name: 'Escola Superior de Ciências Empresariais',
    },
    {
      id: 6,
      title: 'ESA',
      name: 'Escola Superior Agrária',
    },
    {
      id: 7,
      title: 'SAS',
      name: 'Serviços de Acção Social',
    },
  ];

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
          Recommendations
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
                  <View>
                    <Text style={{fontSize: 22, fontWeight: '700'}}>
                      {item.title}
                    </Text>
                    <Text style={{fontSize: 14, opacity: 0.7}}>
                      From: {item.city}
                    </Text>
                    <Text style={{fontSize: 14, opacity: 0.7}}>
                      To: {item.city}
                    </Text>
                    <Text style={{fontSize: 12, opacity: 0.8, color: 'blue'}}>
                      {item.date}
                    </Text>
                  </View>
                </Animated.View>
              );
            }}
          />
        </View>
      </View>
    );
  }

  function getMyNextRide() {}

  function getRecommendations() {}

  function renderMyNextTravel() {
    return (
      <View>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 24,
            fontFamily: 'Arial',
            color: 'white',
            position: 'relative',
            fontWeight: '400',
            marginTop: 30,
          }}>
          Your next travel
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Animated.FlatList
            horizontal
            data={NEXT_TRAVEL_2}
            contentContainerStyle={{padding: SPACING}}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate('DestinationDetail')}>
                  <Animated.View
                    style={{
                      flexDirection: 'row',
                      padding: SPACING,
                      marginBottom: SPACING,
                      shadowRadius: 20,
                      marginRight: 20,
                      borderRadius: 12,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                    }}>
                    <View>
                      <Text style={{fontSize: 22, fontWeight: '700'}}>
                        {item.title}
                      </Text>
                      <Text
                        style={{fontSize: 18, opacity: 0.9, fontWeight: '500'}}>
                        {item.startTime}
                      </Text>
                      <Text style={{fontSize: 16, opacity: 0.7}}>
                        {item.address}
                      </Text>
                      <Text style={{fontSize: 12, opacity: 0.8, color: 'blue'}}>
                        Travel time: {item.time}
                      </Text>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        </View>
      </View>
    );
  }

    function renderDestinations() {
      return (
        <View>
          <Text
            style={{
              marginLeft: 15,
              fontSize: 24,
              fontFamily: 'Arial',
              color: 'white',
              position: 'relative',
              fontWeight: '400',
              marginTop: 30,
            }}>
            Destinations
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Animated.FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={DESTINATIONS}
              contentContainerStyle={{padding: SPACING}}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate('DestinationSearch', {
                        title: item.title,
                        name: item.name,
                      })
                    }>
                    <Animated.View
                      style={{
                        flexDirection: 'row',
                        padding: SPACING,
                        marginBottom: SPACING,
                        shadowRadius: 20,
                        marginRight: 20,
                        borderRadius: 12,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}>
                      <View>
                        <Text style={{fontSize: 22, fontWeight: '700'}}>
                          {item.title}
                        </Text>
                        <Text style={{fontSize: 14, fontWeight: '500'}}>
                          {item.name}
                        </Text>
                      </View>
                    </Animated.View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </View>
        </View>
      );
    }
  function renderBody() {
    return (
      <View style={{alignItems: 'center', position: 'relative'}}>
        {hasNextRide ? renderMyNextTravel() : renderDestinations()}
        {recommendationsNearMe()}
      </View>
    );
  }

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
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

        <SearchBar
          placeholder="Where you want to go?"
          onChangeText={setSearch}
          value={search}
          searchIcon={false}
          containerStyle={{
            flex: 1,
            marginLeft: 20,
            borderRadius: 20,
            marginRight: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          inputContainerStyle={{
            borderRadius: 20,
            backgroundColor: "transparent",
            justifyContent: 'center',
            alignItems: 'center',
          }}
          inputStyle={{
            textAlign: "center",
            fontSize: 16,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Messages')}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.send}
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

  function renderActionButton(){
    return (
      <ActionButton
        buttonColor={COLORS.primary}
        onPress={() => navigation.navigate('CreateCarPooling')}
      />
    );
  }
  return (
    <ImageBackground style={{flex: 1, resizeMode: 'cover'}} source={images.background}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderBody()}
        {renderActionButton()}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.primary,
    letterSpacing: 1,
  },
});
