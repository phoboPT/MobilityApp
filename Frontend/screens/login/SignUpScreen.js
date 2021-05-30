import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const SignUpScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>SignIn Screen</Text>
      <Button title="Click Here" onPress={() => alert('Button Clicked')} />
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8fcbbc',
  },
});
