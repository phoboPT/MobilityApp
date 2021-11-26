import React from 'react';
import {Text, View, Dimensions, StyleSheet, Image} from 'react-native';

const RecomCard = () => {
  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.imageStyle}
        source={require('../assets/images/ipvc.jpeg')}
      />
    </View>
  );
};

const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
  cardContainer: {
    width: deviceWidth - 25,
    backgroundColor: 'white',
    height: 200,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 10,

    shadowColor: '#000',
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 10,
  },
  imageStyle: {
    height: 120,
    width: deviceWidth - 30,
    borderRadius: 20,
  },
});
export default RecomCard;
