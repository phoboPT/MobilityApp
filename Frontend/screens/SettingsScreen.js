import React, {useState} from 'react';
import {NativeModules} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Section,
} from 'react-native';
import ActivityDB from './ActivityDBModule';
import {
  Button,
  Center,
  Container,
  TextArea,
  Switch,
  Pressable,
  ScrollView,
} from 'native-base';
import {icons, SIZES} from '../constants/index';
const {
  HAR_Module,
  ReportModuleManager,
  RecommendationsManager,
  ActivitiesDatabaseModule,
} = NativeModules;

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
  const [search, setSearch] = useState('');
  const [checked, setCheked] = useState('');

  const onPress_HAR_Begin_Service = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    HAR_Module.HAR_Begin_Service();
  };

  const onPress_ReportVerifyService = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    ReportModuleManager.VerifyIfReportServiceIsRunning();
  };

  const onPress_ReportCalculateReportNow = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    ReportModuleManager.CalculateCurrentReport();
  };

  const onPress_HAR_Stop_Service = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    HAR_Module.HAR_Stop_Service();
  };

  const manageAR = () => {
    if (!checked) {
      onPress_HAR_Begin_Service();
    } else {
      onPress_HAR_Stop_Service();
    }
    setCheked(!checked);
  };

  function renderHeader() {
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
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <Center>
        <Container>
          <ScrollView
            h="80"
            _contentContainerStyle={{
              px: '10px',
            }}>
            <Center>
              <Text>Activity Recognition </Text>
              <TextArea isDisabled>
                This activates a permanent background service that will be
                responsible for multiple background activities: (1) the constant
                human activity recognition, (2) the collection of GPS
                coordinates to attach to the recognised activity (to estimate
                the physical effort, (3) to produce a health report recurrently,
                (4) to store this report in a database of reports for the whole
                week, and (5) to generate recommendations once a week from the
                set of available reports (up to 7 previous reports).
              </TextArea>
              <Text>
                Avtivity Recognition
                <Switch
                  size="md"
                  onToggle={() => manageAR()}
                  isChecked={checked}
                />
              </Text>
              {/* <Button
              title=""
              color="#841584"
              onPress={onPress_HAR_Begin_Service}>
              Start AR
            </Button>
            <Text> </Text>
            <Button title="" color="#841584" onPress={onPress_HAR_Stop_Service}>
              Stop AR
            </Button> */}
              <Text> </Text>
            </Center>
            <ActivityDB />
            <Text />
            <Button onPress={() => onPress_ReportCalculateReportNow()}>
              Report
            </Button>
            <Text />
            <Button onPress={() => onPress_ReportVerifyService()}>
              Verify Service
            </Button>
          </ScrollView>
        </Container>
      </Center>
    </View>
  );
};

export default SettingsScreen;
