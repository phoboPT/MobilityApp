import React, {useState, useEffect} from 'react';
import {NativeModules} from 'react-native';
import {Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ActivityDB from './ActivityDBModule';
import {
  View,
  Button,
  Center,
  Container,
  TextArea,
  Switch,
  ScrollView,
} from 'native-base';
import {icons, SIZES} from '../constants/index';
const {HAR_Module, RecommendationsManager, UserProfileModule} = NativeModules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 30,
    height: 30,
  },
  view: {flexDirection: 'row', height: 40},
  touchable: {
    width: 50,
    paddingLeft: SIZES.padding * 1,
    justifyContent: 'center',
  },
  view_2: {
    borderRadius: 20,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable_2: {
    borderRadius: 20,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_settings: {
    fontSize: 24,
    fontWeight: '400',
  },
});

const SettingsScreen = ({navigation}) => {
  // const [search, setSearch] = useState('');
  const [checked, setCheked] = useState('');

  useEffect(() => {
    // console.log(HAR_Module.isMyServiceRunning());
  });

  const manageAR = () => {
    if (!checked) {
      HAR_Module.HAR_Begin_Service();
    } else {
      HAR_Module.HAR_Stop_Service();
    }
    setCheked(!checked);
  };
  const registerUser = () => {
    UserProfileModule.Set_User_ID('UserID');
    UserProfileModule.Set_User_Name('Teste');
    UserProfileModule.Set_User_BirthDate('19920813');
    UserProfileModule.Set_User_Gender('m');
    UserProfileModule.Set_User_Height('165');
    UserProfileModule.Set_User_Weight('65');
    UserProfileModule.Set_Health_Activity_Risk('3');
  };

  const renderHeader = () => {
    return (
      <View style={styles.view}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.touchable}>
          <Image
            source={icons.menu}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
        <View style={styles.view_2}>
          <Text style={styles.text_settings}>Settings</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <Center>
        <Container>
          <ScrollView h="80">
            <Center>
              <Text>Activity Recognition </Text>

              <Text>
                Avtivity Recognition
                <Switch
                  size="md"
                  onToggle={() => manageAR()}
                  isChecked={checked}
                />
              </Text>

              <Text> </Text>
            </Center>

            <ActivityDB />
            <Text />

            <Text />
            <Button onPress={() => registerUser()}>User register</Button>
          </ScrollView>
        </Container>
      </Center>
    </View>
  );
};

export default SettingsScreen;
