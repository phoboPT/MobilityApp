import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const MapScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Map Screen</Text>
      <Button title="Click Here" onPress={() => alert('Button Clicked')} />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8fcbbc',
  },
});
