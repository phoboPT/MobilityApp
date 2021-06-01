import React from 'react';
import {SafeAreaView} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import {icons, COLORS, SIZES} from '../constants/index';
import ActionButton from 'react-native-action-button';
import faker from 'faker';
import Search from '../components/Search';

faker.seed(10);
const image = {
  uri: 'https://digitalsynopsis.com/wp-content/uploads/2017/02/beautiful-color-gradients-backgrounds-030-happy-fisher.png',
};
const DATA = [...Array(5).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.random.number(60)}.jpg`,
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

  function recommendationsNearMe() {
    return (
      <View>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 24,
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
        {renderMyNextTravel()}
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

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Search />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MessagesScreen')}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
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
    <ImageBackground style={{flex: 1, resizeMode: 'cover'}} source={image}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderBody()}
        <ActionButton
          buttonColor={COLORS.primary}
          onPress={() => {
            console.log('Adicionar nova boleia');
          }}
        />
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
