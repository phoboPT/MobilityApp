import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const CarPoolingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>CarPooling Screen</Text>
      <Button title="Click Here" onPress={() => alert('Button Clicked')} />
    </View>
  );
};

export default CarPoolingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8fcbbc',
  },
});
