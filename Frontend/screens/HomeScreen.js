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
import {ScrollView} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Value} from 'react-native-reanimated';
import {loadOptions} from '@babel/core';

// PASSOS
/*
1 - Verificar se existe próxima boleia 
2 - Verificar boleia se existe boleias recomendadas a partir do meu local
*/

faker.seed(10);
const DATA = [...Array(3).keys()].map((_, i) => {
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
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'ESTG', value: 'Escola Superior de Tecnologia e Gestão'},
    {label: 'ESE', value: 'Escola Superior de Educação'},
    {label: 'ESA', value: 'Escola Superior Agrária'},
    {label: 'ESS', value: 'Escola Superior de Saúde'},
    {label: 'ESDL', value: 'Escola Superior de Desporto e Lazer'},
    {label: 'ESCE', value: 'Escola Superior de Ciências Empresariais'},
    {label: 'SAS', value: 'Serviços Académicos'},
  ]);

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
            marginTop: 10,
            fontFamily: 'Arial',
            color: 'white',
            fontWeight: '400',
          }}>
          Recommendations
        </Text>
        <View>
          <Animated.FlatList
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}
            data={DATA}
            contentContainerStyle={{padding: 20}}
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
                    opacity,
                    transform: [{scale}],
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
        <DropDownPicker
          open={open}
          closeAfterSelecting={true}
          itemSeparator={true}
          value={value}
          itemKey="label"
          theme="DARK"
          schema={{
            label: 'label',
            value: 'value',
          }}
          items={items}
          onChangeValue={() => {
            var item = items.filter(obj => {
              return obj.value === value;
            });
            navigation.navigate('DestinationSearch', {
              endLocation: item[0].label,
              name: item[0].value,
            });
          }}
          placeholder="Where you want to go?"
          setOpen={setOpen}
          setValue={setValue}
          containerStyle={{
            flex: 1,
            width: 330,
            marginTop: 40,
            marginBottom: 10,
            marginLeft: 30,
            marginRight: 30,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          searchTextInputStyle={{
            borderRadius: 30,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
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
            data={items}
            contentContainerStyle={{padding: SPACING}}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('DestinationSearch', {
                      endLocation: item.label,
                      name: item.value,
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
                        {item.label}
                      </Text>
                      <Text style={{fontSize: 14, fontWeight: '500'}}>
                        {item.value}
                      </Text>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    );
  }
  function renderBody() {
    return (
      <View>
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
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 24, fontWeight: '400'}}>Home</Text>
        </View>
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

  function renderActionButton() {
    return (
      <ActionButton
        buttonColor={COLORS.primary}
        onPress={() => navigation.navigate('CreateCarPooling')}
      />
    );
  }
  return (
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
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
});
