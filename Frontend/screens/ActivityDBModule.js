import React, {Component} from 'react';
import {NativeModules} from 'react-native';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import {Text, Button, ScrollView} from 'native-base';

const {ActivitiesDatabaseModule} = NativeModules;

class ActivityDB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
    };
  }

  //, activityType, activityDescription, confidence, timestamp, userID
  GetFlatListItem(id) {
    Alert.alert(id);
  }

  ResetDB = () => {
    ActivitiesDatabaseModule.DeleteAllRecordsFromDB();
    // eslint-disable-next-line no-alert
    alert('Deleted.');
  };

  PrintEntireDB = () => {
    ActivitiesDatabaseModule.ReadAllDataFromDBIntoReactNative(array => {
      console.log(array, 'The array you sent from the native side');
      // [{"activityDescription": "STILL", "activityType": 3, "confidence": 100, "id": 1, "timestamp": "2021-11-19 19:30:35.517", "userID": "98765"}]

      this.setState({
        dataSource: array.reverse(),
      });
    });
  };

  render() {
    return (
      <View>
        <View>
          <Button onPress={() => this.PrintEntireDB()}>
            Show All DB Records
          </Button>

          <ScrollView
            maxW="400"
            maxH="40"
            _contentContainerStyle={{
              px: '20px',
              mb: '4',
              minW: '72',
            }}>
            {this.state.dataSource.length > 0 &&
              this.state.dataSource.map(item => {
                return (
                  <Text key={item.id}>
                    {item.id} -> {item.activityType}: {item.activityDescription}{' '}
                    - {item.confidence}%. {item.timestamp.split(' ')[0]}. [
                    {item.latitude};{item.longitude}]
                  </Text>
                );
              })}
          </ScrollView>
          <TouchableOpacity
            style={styles.submitButtonBig}
            onPress={() => this.ResetDB()}>
            <Text style={styles.submitButtonText}> Delete All DB Records </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  FlatListItemStyle: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  container: {
    paddingTop: 100,
    paddingHorizontal: 30,
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
    margin: 0,
    height: 40,
    width: 300,
  },
  submitButtonText: {
    color: 'white',
  },
});

export default ActivityDB;
