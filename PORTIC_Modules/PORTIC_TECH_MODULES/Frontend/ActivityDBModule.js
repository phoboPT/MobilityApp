/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {NativeModules} from 'react-native';
import {
  AppRegistry,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SectionList,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';


import { DataTable } from 'react-native-paper';

const {ActivitiesDatabaseModule} = NativeModules;

class ActivityDB extends Component {

constructor(props)
{
    super(props);

    this.state = { 
      dataSource: [],
    };
}


FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: '#607D8B',
        }}
      />
    );
  }
//, activityType, activityDescription, confidence, timestamp, userID
  GetFlatListItem (id) {
    Alert.alert(id);
  }




  ResetDB = () => {
    ActivitiesDatabaseModule.DeleteAllRecordsFromDB();
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
      <View >
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.submitButtonBig}
            onPress={() => this.PrintEntireDB()}>
            <Text style={styles.submitButtonText}> Show All DB Records </Text>
          </TouchableOpacity>


          <View style={styles.MainContainer}>
  
              <FlatList data={this.state.dataSource}
                        extraData={this.state}
                        // style={{marginBottom: 200}}
                          renderItem={({ item }) =>
                          <View
                              style={{marginTop: 0, width: '100%', justifyContent: 'center', alignItems: 'center'}}  >
                                <View style={{paddingTop: 10,paddingBottom:0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{backgroundColor: '#000000', paddingHorizontal: 20, borderRadius: 10, elevation: 1, shadowColor: "#0000002B", shadowRadius: 3, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1.0}}>
                                        <Text style={{fontSize: 8, fontFamily: 'BebasKai', color: '#FFFFFF', textAlign: 'left', paddingHorizontal: 20, paddingVertical: 4}}>{item.id} -> {item.activityType}: {item.activityDescription} - {item.confidence}%. {item.timestamp}. [{item.latitude};{item.longitude}]</Text>
                                    </View>

                                </View>
                          </View>

              } />
          </View>

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
  MainContainer :{ 
    justifyContent: 'center',
    flex:1,
    margin: 10,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
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
