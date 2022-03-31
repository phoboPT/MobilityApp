import React, {useState, useEffect} from 'react';
import {NativeModules} from 'react-native';
import {Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {View, Button, Center, Container, ScrollView} from 'native-base';
import {icons, SIZES} from '../constants/index';
const {RecommendationsManager} = NativeModules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 30,
    height: 30,
  },
  view: {flexDirection: 'row', height: 40},
  touchable: {
    width: 50,
    paddingLeft: SIZES.padding * 1,
    justifyContent: 'center',
  },
  view_2: {
    borderRadius: 20,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text_settings: {
    fontSize: 24,
    fontWeight: '400',
  },
  row: {flexDirection: 'row'},
  button: {
    justifyContent: 'space-around',
    margin: 10,
  },
});

const Statistics = ({navigation}) => {
  const [mets, setMets] = useState('');
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  useEffect(() => {
    RecommendationsManager.ReadAllWeeklyReportsFromDBIntoReactNative(result => {
      setMets(result);
      setLength(result.length - 1);
    });
  });

  const renderHeader = () => {
    return (
      <View style={styles.view}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.touchable}>
          <Image
            source={icons.menu}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
        <View style={styles.view_2}>
          <Text style={styles.text_settings}>Statistics</Text>
        </View>
      </View>
    );
  };

  const next = () => {
    if (index < length) {
      setIndex(index + 1);
    }
  };
  const previous = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}

      <Center>
        <Container>
          <ScrollView h="80">
            <Center>
              <Text>Data</Text>
              <Text />
              <Center>
                {mets.length > 0 && (
                  <Text key={mets[index].id}>
                    -----------------{mets[index].id}----------------- {'\n'}
                    Mets Baixa- {mets[index].metsIntBaixa}
                    {'\n'}
                    Mets Totais - {mets[index].metsTotais}
                    {'\n'}
                    Mets Vigorosa - {mets[index].metsIntVigorosa}
                    {'\n'}
                    Minutos de atividade -
                    {mets[index].totalAmountActiveActivityInMinutes}
                    {'\n'}
                    Distancia a pe - {mets[index].distanceWalking.toFixed(2)}
                    {'\n'}
                    Distancia a correr - {mets[index].distanceRunning}
                    {'\n'}
                    Distancia em bicicleta - {mets[index].distanceBicycle}
                    {'\n'}
                    Horas sedentários - {mets[index].totalAmountSedentaryHours}
                    {'\n'}
                    Minutos sedentários -
                    {mets[index].totalAmountSedentaryMinutes}
                    {'\n'}
                    Data: [{mets[index].dateOfReport}]
                  </Text>
                )}
              </Center>
            </Center>
            <View style={styles.row}>
              <Button
                style={styles.button}
                onPress={() => previous()}
                disabled={index > 0 ? false : true}>
                Previous
              </Button>

              <Button
                style={styles.button}
                onPress={() => next()}
                disabled={index < mets.length - 1 ? false : true}>
                Next
              </Button>
            </View>
          </ScrollView>
        </Container>
      </Center>
    </View>
  );
};

export default Statistics;
