import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const MessagesScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Messages Screen</Text>
      <Button title="Click Here" onPress={() => alert('Button Clicked')} />
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8fcbbc',
  },
});
