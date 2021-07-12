import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {COLORS, SIZES, images} from '../constants';

const Onboarding = ({navigation}) => {
  // Render

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={images.logo}
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', marginHorizontal: SIZES.padding}}>
          <Text style={{fontWeight: '600', fontSize: 45}}>Mobility One</Text>
          <Text
            style={{
              color: COLORS.gray,
              marginTop: SIZES.padding,
              textAlign: 'center',
              fontSize: 15,
            }}>
            All transports in your pocket
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.shadow,
            {
              marginTop: SIZES.padding * 2,
              width: '70%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
          onPress={() => navigation.navigate('AuthLoading')}>
          <LinearGradient
            style={{
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
            }}
            colors={['#46aeff', '#5884ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={{color: COLORS.white}}>Start !</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default Onboarding;
