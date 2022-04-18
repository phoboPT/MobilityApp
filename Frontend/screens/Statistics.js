import React, {useState, useEffect} from 'react';
import {NativeModules} from 'react-native';
import {Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {View, Button, Center, Container, ScrollView} from 'native-base';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {icons, SIZES} from '../constants/index';
import {Dimensions} from 'react-native';
import {withTheme} from 'react-native-elements';
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
  view: {flexDirection: 'row', height: 40, alignItems: 'center'},
  touchable: {
    width: 50,
    paddingLeft: SIZES.padding * 1,
    justifyContent: 'center',
  },
  view_2: {
    borderRadius: 10,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text_settings: {
    fontSize: 24,
    fontWeight: '400',
    color: 'white',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  button: {
    justifyContent: 'space-around',
    margin: 10,
    alignItems: 'center',
  },
});

const Statistics = ({navigation}) => {
  const [mets, setMets] = useState(null);
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  useEffect(() => {
    RecommendationsManager.ReadAllWeeklyReportsFromDBIntoReactNative(result => {
      setMets(result);
      setLength(result.length - 1);
      console.log(result);
    });
  }, []);

  const renderHeader = () => {
    return (
      <View style={styles.view} bgColor="blueGray.800">
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
    // if mets is not populated yet, do not render anything
    !mets ? null : (
      <View style={styles.container}>
        {renderHeader()}

        <Center bgColor="blueGray.800">
          <Container>
            <ScrollView h="80">
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
              <View>
                <Text style={styles.text_settings}>Mets Cumpridos</Text>
                <ProgressChart
                  data={{
                    labels: ['Baixa', 'Moderada', 'Vigorosa'],

                    data: [
                      mets[index].metsIntBaixaPercentage,
                      mets[index].metsIntModeradaPercentage,
                      mets[index].metsIntVigorosaPercentage,
                    ],
                  }}
                  width={Dimensions.get('window').width - 80} // from react-native
                  height={220}
                  strokeWidth={16}
                  radius={30}
                  chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: '#08130D',
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false, // optional
                  }}
                  hideLegend={false}
                />
              </View>
              <View>
                <Text style={styles.text_settings}>Atividade Diária</Text>
                <BarChart
                  data={{
                    labels: ['Parado', 'Caminhar', 'Correr', 'Bicicleta'],
                    datasets: [
                      {
                        data: [
                          mets[index].amountTimeStillMinute,
                          mets[index].amountTimeWalkingMinute,
                          mets[index].amountTimeRunningMinute,
                          mets[index].amountTimeOnBicycleMinute,
                        ],
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width - 80} // from react-native
                  height={220}
                  yAxisLabel="min"
                  verticalLabelRotation={20}
                  chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: '#08130D',
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false, // optional
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            </ScrollView>
          </Container>
        </Center>
      </View>
    )
  );
};

export default Statistics;

