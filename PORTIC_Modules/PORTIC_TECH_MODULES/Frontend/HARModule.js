/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {NativeModules} from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

const {HAR_Module} = NativeModules;

class HarModuleApp extends Component {
  state = {
    text: 'Useless Text',
  };
  UpdateState = () => this.setState({text: 'Text Updated'});

  onPress_HAR_Begin_Service = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    HAR_Module.HAR_Begin_Service();
  };

  onPress_HAR_Stop_Service = () => {
    //console.log('We will invoke the native module here!');
    //  CalendarModule.createCalendarEvent('testName', 'testLocation');
    HAR_Module.HAR_Stop_Service();
  };

  //const [text, onChangeText] = React.useState('Useless Text');

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.submitButtonBig}
            onPress={() => this.onPress_HAR_Begin_Service()}>
            <Text style={styles.submitButtonText}>
              {' '}
              Start Human Activity Recognition Service{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButtonBig}
            onPress={() => this.onPress_HAR_Stop_Service()}>
            <Text style={styles.submitButtonText}>
              {' '}
              Stop Human Activity Recognition Service{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
  },
  input: {
    margin: 5,
    height: 40,
    width: 150,
    borderColor: '#7a42f4',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 5,
    width: 75,
    height: 40,
  },
  submitButtonBig: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
    width: 300,
  },
  submitButtonText: {
    color: 'white',
  },
});

export default HarModuleApp;
