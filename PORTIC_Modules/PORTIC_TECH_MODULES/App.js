/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {NativeModules} from 'react-native';
import Inputs from './Frontend/UserInputs.js';
import ActivityDBModule from './Frontend/ActivityDBModule.js';


const {HAR_Module} = NativeModules;
const {ReportModuleManager} = NativeModules;


import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onPress_HAR_Begin_Service = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    HAR_Module.HAR_Begin_Service();
  };

  const onPress_ReportBeginService = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    ReportModuleManager.Begin_Report_Handler_Module();
  };
  const onPress_ReportVerifyService = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    ReportModuleManager.VerifyIfReportServiceIsRunning();
  };
  const onPress_ReportStopService = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    ReportModuleManager.Stop_Report_Handler_Module();
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

  const [text, onChangeText] = React.useState('Useless Text');

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps='always'
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="1: Create User Preferences">
            <Text style={styles.BodyText}>This step is required before anything else. A UserID must exist 
          to associate it to all the records to be put in the databases (the activities DB, the health 
          reports DB, ...).</Text>
          </Section>
          <Section >
            <Inputs />
          </Section>

          <Section title="2: Activate PORTIC Health Service" >
            <Text style={styles.BodyText}>This activates a permanent background service that will be responsible for
            multiple background activities: (1) the constant human activity recognition,
            (2) the collection of GPS coordinates to attach to the recognised activity (to 
            estimate the physical effort, (3) to produce a health report recurrently, (4) to store 
            this report in a database of reports for the whole week, and (5) to generate 
            recommendations once a week from the set of available reports (up to 7 previous reports).</Text>
            <Text> </Text>
              <Button
                title="Start Activity Recognition Service"
                color="#841584"
                onPress={onPress_HAR_Begin_Service}
              />
              <Text> </Text>
              <Button
                title="Stop Activity Recognition Service"
                color="#841584"
                onPress={onPress_HAR_Stop_Service}
              />
          </Section>

          <Section title="[Optional] Explicit Interaction with backend services">
            <Text>You can use the bottom sections to interact with specific modules in the background,
            whether it be consulting the recognised human activities data, interaction with the health 
            report, etc.</Text>
          </Section>

          <Section title="Activities Database">
            <ActivityDBModule />
          </Section>

          <Section title="Report Handler">
              <Button style={styles.submitButtonBig}
                title="Calculate Report of Today!"
                onPress={onPress_ReportCalculateReportNow}
              />
              <Text> </Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  MainContainer :{ 
    justifyContent: 'center',
    flex:1,
    margin: 10,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  BodyText: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 100,
    margin: 12,
    borderWidth: 10,
    padding: 10,
  },
  submitButtonBig: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 0,
    height: 40,
    width: 300,
  },
});

export default App;
