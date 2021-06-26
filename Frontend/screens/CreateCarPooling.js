import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {icons, SIZES, COLORS} from '../constants';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';

const CreateCarPooling = ({navigation}) => {
  const [photo, setPhoto] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [startLocation, setStartLocation] = React.useState('');
  const [endLocation, setEndLocation] = React.useState('');
  const [date, setDate] = useState(null);

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      // TODO ERRO
      if (response.assets[0]) {
        setPhoto(response.assets[0]);
      } else {
        setPhoto(null);
      }
    });
  };
  const postCarPooling = async () => {
    //Enviar dados
    if (
      title === null ||
      description === null ||
      startLocation === '' ||
      endLocation === '' ||
      date == null
    ) {
      Alert.alert('There is missing information,');
    } else {
      // Enviar pedido POST à API
      console.log('Funcionou');
    }
  };

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
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
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            paddingRight: 46,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 20}}>Create Car Pooling</Text>
        </View>
      </View>
    );
  }

  function renderCreateCarPooling() {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        {photo ? (
          <>
            <Image
              source={{uri: photo.uri}}
              style={{width: '100%', height: 300}}
            />
            <Button
              onPress={() => handleChoosePhoto()}
              buttonStyle={{
                marginTop: 30,
                backgroundColor: COLORS.secondary,
                borderRadius: 10,
              }}
              titleStyle={{color: COLORS.white}}
              icon={<Icon name="upload" size={24} color="white" />}
              iconRight
              title="Change Image     "
            />
          </>
        ) : (
          <>
            <Button
              onPress={() => handleChoosePhoto()}
              buttonStyle={{
                marginTop: 30,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
              }}
              titleStyle={{color: COLORS.white}}
              icon={<Icon name="upload" size={24} color="white" />}
              iconRight
              title="Upload Image     "
            />
          </>
        )}
        <Input
          style={{marginTop: 30}}
          containerStyle={{width: '90%'}}
          placeholder="Title"
          onChangeText={value => setTitle(value)}
        />

        <Input
          placeholder="Description"
          multiline
          containerStyle={{width: '90%'}}
          onChangeText={value => setDescription(value)}
        />

        <Input
          placeholder="Start Location"
          multiline
          containerStyle={{width: '90%'}}
          onChangeText={value => setStartLocation(value)}
        />

        <Input
          placeholder="End Location"
          multiline
          containerStyle={{width: '90%'}}
          onChangeText={value => setEndLocation(value)}
        />
        <View>
          <Text
            style={{
              fontSize: SIZES.body2,
              fontWeight: '300',
              color: COLORS.gray,
            }}>
            Start Time
          </Text>
          <DatePicker
            collapsable
            locale="pt"
            is24hourSource="locale"
            androidVariant="iosClone"
            date={date}
            onDateChange={setDate}
          />
        </View>

        <Button
          onPress={() => postCarPooling()}
          buttonStyle={{
            backgroundColor: COLORS.primary,
            borderRadius: 10,
          }}
          titleStyle={{color: COLORS.white}}
          icon={<Icon name="chevron-circle-down" size={28} color="white" />}
          iconRight
          title="Post Ride     "
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView>{renderCreateCarPooling()}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CreateCarPooling;
