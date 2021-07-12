import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {icons, SIZES, COLORS, images} from '../constants';
import {Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../services/api';
import NumericInput from 'react-native-numeric-input';
import {ScrollView} from 'react-native';

const CreateVehicle = ({navigation}) => {
  const [carModel, setCarModel] = React.useState('');
  const [capacity, setCapacity] = React.useState(2);

  const validateInputs = () => {
    //Enviar dados
    if (carModel === '') {
      Alert.alert('You need to add the Car Model');
    } else {
      postCreateVehicle();
    }
  };

  const postCreateVehicle = async () => {
    try {
      const response = await api.post('/vehicles', {
        carModel: carModel,
        type: 2,
        capacity: capacity,
      });
      if (response.data != undefined) {
        Alert.alert('Vehicle created');
        navigation.navigate('Drawer');
      }
    } catch (err) {
      Alert.alert('Error on new vehicle. Please try Again!');
    }
  };

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Drawer')}
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
          <Text style={{fontSize: 24, fontWeight: '400'}}>Create Vehicle</Text>
        </View>
      </View>
    );
  }

  function renderCreateVehicle() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'column',
        }}>
        <Input
          placeholder="Car Model"
          multiline
          placeholderTextColor="black"
          containerStyle={{marginTop: 15, width: '90%', zIndex: -2}}
          onChangeText={value => setCarModel(value)}
        />
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
            Vehicle Capacity
          </Text>
          <NumericInput
            value={capacity}
            onChange={value => setCapacity(value)}
            onLimitReached={() => Alert.alert('Minimum vehicle capacity is 2')}
            totalWidth={240}
            editable
            maxValue={9}
            minValue={2}
            totalHeight={50}
            iconSize={25}
            step={1}
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
        <Button
          onPress={() => validateInputs()}
          buttonStyle={{
            backgroundColor: COLORS.primary,
            borderRadius: 10,
          }}
          titleStyle={{color: COLORS.white}}
          icon={
            <Icon name="car" style={{marginLeft: 10}} size={28} color="white" />
          }
          iconRight
          title="Create Vehicle"
        />
      </View>
    );
  }

  return (
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
      <SafeAreaView>
        {renderHeader()}
        <ScrollView>{renderCreateVehicle()}</ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default CreateVehicle;
