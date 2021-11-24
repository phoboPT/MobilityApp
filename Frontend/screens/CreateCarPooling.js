import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {icons, SIZES, COLORS, images} from '../constants';
import {Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import api from '../services/api';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  container: {flexDirection: 'row', height: 50},
});

const CreateCarPooling = ({navigation}) => {
  const [description, setDescription] = React.useState('');
  const [startLocation, setStartLocation] = React.useState('');
  const [endLocation, setEndLocation] = React.useState('');
  const [estimatedTime, setEstimatedTime] = React.useState(10);
  const [userVehicles, setUserVehicles] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [vehicle, setVehicle] = React.useState(null);
  const [capacities, setCapacities] = React.useState(null);
  const [capacity, setCapacity] = React.useState(null);
  const [userImage, setUserImage] = React.useState(null);
  const [vehicleChoosed, setVehicleChoosed] = React.useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);

  const [capacityOptions, setCapacityOptions] = useState(null);

  const [items, setItems] = useState([
    {label: 'ESTG', value: 'Escola Superior de Tecnologia e Gestão'},
    {label: 'ESE', value: 'Escola Superior de Educação'},
    {label: 'ESA', value: 'Escola Superior Agrária'},
    {label: 'ESS', value: 'Escola Superior de Saúde'},
    {label: 'ESDL', value: 'Escola Superior de Desporto e Lazer'},
    {label: 'ESCE', value: 'Escola Superior de Ciências Empresariais'},
    {label: 'SAS', value: 'Serviços Académicos'},
  ]);

  useEffect(() => {
    async function checkIfUserHasVehicles() {
      try {
        const response = await api.get('/vehicles/me');
        if (response.data.length === 0) {
          Alert.alert(
            'You need to create a vehicle to introduce a ride',
            null,
            [
              {
                text: 'Cancel',
                onPress: () => navigation.navigate('Home'),
                style: 'cancel',
              },
              {
                text: 'Create Vehicle',
                onPress: () => navigation.navigate('CreateVehicle'),
              },
            ],
          );
        } else {
          setUserVehicles(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function getUserImage() {
      try {
        const value = await AsyncStorage.getItem('@App:userIMAGE');
        if (value !== null) {
          setUserImage(value);
        } else {
          setUserImage(
            'https://res.cloudinary.com/hegs/image/upload/v1625155512/default-user_amkn6r.png',
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserImage();
    checkIfUserHasVehicles();
  }, []);
  const validateInputs = () => {
    //Enviar dados
    if (
      description === null ||
      startLocation === '' ||
      endLocation === '' ||
      date == null ||
      vehicle == null ||
      capacity == null
    ) {
      Alert.alert('There is missing information!');
    } else {
      postCarPooling();
    }
  };

  const postCarPooling = async () => {
    try {
      await api.post('/routes', {
        type: '2',
        startLocation: startLocation,
        endLocation: endLocation,
        vehicleId: vehicle,
        state: 'AVAILABLE',
        description: description,
        estimatedTime: estimatedTime,
        startDate: date,
        userImage: userImage,
        capacity: capacity,
      });
      Alert.alert('Ride created with success!');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error on creating new ride. Please try Again!');
    }
  };

  const CarPoolingCapacity = async idVehicle => {
    setVehicle(idVehicle);
    var capacityList = [];
    var arrayOfObjects = [];
    var vehicleCapacity = 0;

    // Find Vehicle Capacity By ID
    for (var i = 0; i < userVehicles.length; i++) {
      if (userVehicles[i].id === idVehicle) {
        vehicleCapacity = userVehicles[i].capacity;
      }
    }

    // Generate Numbers from Max Capacity to 2 (Driver + Someone is the Minimum Value)
    capacityList = Array(vehicleCapacity - 1)
      .fill()
      .map((d, i) => i + 2);

    // For each element create an object to push to array so we can list on Dropdown
    capacityList.forEach(element => {
      arrayOfObjects.push({value: element, label: element});
    });

    setCapacities(arrayOfObjects);
    setVehicleChoosed(true);
  };
  function renderHeader() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
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
            paddingRight: 35,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 24, fontWeight: '400'}}>
            Create Car Pooling
          </Text>
        </View>
      </View>
    );
  }

  function renderCreateCarPooling() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'column',
        }}>
        <DropDownPicker
          open={open}
          closeAfterSelecting={true}
          itemSeparator={true}
          value={value}
          itemKey="label"
          theme="DARK"
          schema={{
            label: 'value',
            value: 'label',
          }}
          items={items}
          placeholder="Start Location"
          setOpen={setOpen}
          setValue={setValue}
          onChangeValue={() => setStartLocation(value)}
          containerStyle={{
            width: '88%',
            marginBottom: 10,
            zIndex: 2,
            marginLeft: 30,
            marginRight: 30,
            marginTop: 10,
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
        <DropDownPicker
          open={open1}
          closeAfterSelecting={true}
          itemSeparator={true}
          value={value1}
          itemKey="label"
          theme="DARK"
          schema={{
            label: 'value',
            value: 'label',
          }}
          items={items}
          placeholder="End Location"
          onChangeValue={() => setEndLocation(value1)}
          setOpen={setOpen1}
          setValue={setValue1}
          containerStyle={{
            width: '88%',
            marginBottom: 10,
            zIndex: 1,
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
        <DropDownPicker
          open={open2}
          closeAfterSelecting={true}
          itemSeparator={true}
          value={value2}
          theme="DARK"
          schema={{
            label: 'carModel',
            value: 'id',
          }}
          items={userVehicles}
          placeholder="Vehicle"
          setOpen={setOpen2}
          setValue={setValue2}
          onChangeValue={() => CarPoolingCapacity(value2)}
          containerStyle={{
            width: '88%',
            marginBottom: 10,
            zIndex: -1,
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

        {vehicleChoosed ? (
          <DropDownPicker
            open={open3}
            closeAfterSelecting={true}
            itemSeparator={true}
            value={value3}
            theme="DARK"
            schema={{
              label: 'label',
              value: 'value',
            }}
            items={capacities}
            placeholder="Seats"
            setOpen={setOpen3}
            setValue={setValue3}
            onChangeValue={() => setCapacity(value3)}
            containerStyle={{
              width: '88%',
              marginBottom: 10,
              zIndex: -2,
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
        ) : null}

        <View style={{zIndex: -3}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: SIZES.body2,
              zIndex: -3,
              marginBottom: 15,
              fontWeight: '400',
              color: COLORS.black,
            }}>
            Estimated Time
          </Text>
          <NumericInput
            value={estimatedTime}
            onChange={value => setEstimatedTime(value)}
            onLimitReached={() =>
              Alert.alert('Reached the minimum value of 10 minutes!')
            }
            totalWidth={240}
            editable
            minValue={10}
            totalHeight={50}
            iconSize={25}
            step={5}
            containerStyle={{
              zIndex: -3,
              marginBottom: 17,
            }}
            valueType="real"
            rounded
            textColor="black"
            iconStyle={{color: 'white'}}
            rightButtonBackgroundColor={COLORS.primary}
            leftButtonBackgroundColor={COLORS.gray}
          />
        </View>

        <Input
          placeholder="Description (Optional)"
          multiline
          placeholderTextColor="black"
          containerStyle={{width: '90%', zIndex: -3}}
          onChangeText={value => setDescription(value)}
        />

        <View style={{zIndex: -3}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: SIZES.body2,
              fontWeight: '400',
              color: COLORS.black,
            }}>
            Start Time
          </Text>
          <DatePicker
            collapsable
            minimumDate={new Date()}
            locale="pt"
            is24hourSource="locale"
            androidVariant="iosClone"
            date={date}
            onDateChange={setDate}
          />
        </View>

        <Button
          onPress={() => validateInputs()}
          buttonStyle={{
            backgroundColor: COLORS.primary,
            borderRadius: 10,
          }}
          titleStyle={{color: COLORS.white}}
          icon={
            <Icon
              name="chevron-circle-down"
              style={{marginLeft: 10}}
              size={28}
              color="white"
            />
          }
          iconRight
          title="Create Ride"
        />
      </View>
    );
  }

  return (
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <SafeAreaView>
          {renderHeader()}
          {renderCreateCarPooling()}
        </SafeAreaView>
      )}
    </ImageBackground>
  );
};

export default CreateCarPooling;
