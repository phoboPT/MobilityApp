import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const MyRoutesScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>MyRoutes Screen</Text>
      <Button title="Click Here" onPress={() => alert('Button Clicked')} />
    </View>
  );
};

export default MyRoutesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8fcbbc',
  },
});
