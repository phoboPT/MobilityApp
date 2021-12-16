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

const {UserProfileModule} = NativeModules;


class Inputs extends Component {
  state = {
    UserID: '',
    UserName: '',
    UserBirthDate: '',
    UserGender: '',
    UserHeight: '',
    UserWeight: '',
  };

  handleUserID = text => {
    this.setState({UserID: text});
  };
  handleUserName = text => {
    this.setState({UserName: text});
  };
  handleUserBirthDate = text => {
    this.setState({UserBirthDate: text});
  };
  handleUserGender = text => {
    this.setState({UserGender: text});
  };
  handleUserHeight = text => {
    this.setState({UserHeight: text});
  };
  handleUserWeight = text => {
    this.setState({UserWeight: text});
  };
  handleUserHealthRisk = text => {
    this.setState({UserHealthRisk: text});
  };
  submitALLProperties = (UserID, UserName, UserBirthDate, UserGender, UserHeight, UserWeight, UserHealthRisk) => {
    //alert('ID: ' + UserID + ' Name: ' + UserName);

    UserProfileModule.Set_User_ID(UserID);
    UserProfileModule.Set_User_Name(UserName);
    UserProfileModule.Set_User_BirthDate(UserBirthDate);
    UserProfileModule.Set_User_Gender(UserGender);
    UserProfileModule.Set_User_Height(UserHeight);
    UserProfileModule.Set_User_Weight(UserWeight);
    UserProfileModule.Set_Health_Activity_Risk(UserHealthRisk);

    alert('Submitted ID: ' + UserID + ' Name: ' + UserName + ' BirthDate: ' +
    UserBirthDate + ' User Gender: ' + UserGender + ' User Height: ' + UserHeight + ' User Weight: ' + 
    UserWeight + ' User Health Risk: ' + 
    UserHealthRisk);
  };
  submitUserID = (UserID) => {
    UserProfileModule.Set_User_ID(UserID);
    alert('Submitted ID: ' + UserID);
  };
  submitUserName = (UserName) => {
    UserProfileModule.Set_User_Name(UserName);
    alert('Submitted Name: ' + UserName);
  };
  submitUserBirthDate = (UserBirthDate) => {
    UserProfileModule.Set_User_BirthDate(UserBirthDate);
    alert('Submitted BirthDate: ' + UserBirthDate);
  };
  submitUserGender = (UserGender) => {
    UserProfileModule.Set_User_Gender(UserGender);
    alert('Submitted Gender: ' + UserGender);
  };
  submitUserHeight = (UserHeight) => {
    UserProfileModule.Set_User_Height(UserHeight);
    alert('Submitted Height: ' + UserHeight);
  };
  submitUserWeight = (UserWeight) => {
    UserProfileModule.Set_User_Weight(UserWeight);
    alert('Submitted Weight: ' + UserWeight);
  };
  submitUserHealthRisk = (UserHealthRisk) => {
    UserProfileModule.Set_Health_Activity_Risk(UserHealthRisk);
    alert('Submitted Health Risk: ' + UserHealthRisk);
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="User Identification"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                    onChangeText={this.handleUserID}/>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.submitUserID(this.state.UserID)}>
                        <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="User Name"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                    onChangeText={this.handleUserName}
                />
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => this.submitUserName(this.state.UserName)}>
                    <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="User Birth Date"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                    onChangeText={this.handleUserBirthDate}/>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.submitUserBirthDate(this.state.UserBirthDate)}>
                        <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="User Gender"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                    onChangeText={this.handleUserGender}/>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.submitUserGender(this.state.UserGender)}>
                        <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="User Height"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                    onChangeText={this.handleUserHeight}/>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.submitUserHeight(this.state.UserHeight)}>
                        <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="User Weight"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                    onChangeText={this.handleUserWeight}/>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.submitUserWeight(this.state.UserWeight)}>
                        <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="User Health Risk"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                    onChangeText={this.handleUserHealthRisk}/>
            </View>
            <View style={{flex:1}}>
                <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this.submitUserHealthRisk(this.state.UserHealthRisk)}>
                        <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>
            </View>
        </View>


        <TouchableOpacity
          style={styles.submitButtonBig}
          onPress={() => this.submitALLProperties(this.state.UserID, this.state.UserName, 
                this.state.UserBirthDate, this.state.UserGender, this.state.UserHeight, this.state.UserWeight, this.state.UserHealthRisk)}>
          <Text style={styles.submitButtonText}> Submit All fields </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default Inputs;

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
