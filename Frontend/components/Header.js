import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import icons, {COLORS} from '../constants/index';

export default function Header({navigation}) {
  const openMenu = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.header}>
      <Image
        source={icons.menu}
        style={{
          tintColor: COLORS.primary,
          resizeMode: 'contain',
          height: 24,
          width: 24,
        }}
      />
      <View>
        <Text style={styles.headerText}>Home</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.primary,
    letterSpacing: 1,
  },
});
