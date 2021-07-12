/*eslint-disable*/
import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  View,
  ActivityIndicator,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {images, icons, SIZES, COLORS} from '../constants';
import api from '../services/api';
import {FlatGrid} from 'react-native-super-grid';
import {Avatar} from 'react-native-elements';
import Moment from 'moment';
import {SectionGrid} from 'react-native-super-grid';

const MyRoutesScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState(null);
  const [myRoutes, setMyRoutes] = useState(null);

  const [items, setItems] = React.useState([
    {name: 'TURQUOISE', code: '#1abc9c'},
    {name: 'EMERALD', code: '#2ecc71'},
    {name: 'PETER RIVER', code: '#3498db'},
    {name: 'AMETHYST', code: '#9b59b6'},
    {name: 'WET ASPHALT', code: '#34495e'},
    {name: 'GREEN SEA', code: '#16a085'},
    {name: 'NEPHRITIS', code: '#27ae60'},
    {name: 'BELIZE HOLE', code: '#2980b9'},
    {name: 'WISTERIA', code: '#8e44ad'},
    {name: 'MIDNIGHT BLUE', code: '#2c3e50'},
    {name: 'SUN FLOWER', code: '#f1c40f'},
    {name: 'CARROT', code: '#e67e22'},
    {name: 'ALIZARIN', code: '#e74c3c'},
    {name: 'CLOUDS', code: '#ecf0f1'},
    {name: 'CONCRETE', code: '#95a5a6'},
    {name: 'ORANGE', code: '#f39c12'},
    {name: 'PUMPKIN', code: '#d35400'},
    {name: 'POMEGRANATE', code: '#c0392b'},
    {name: 'SILVER', code: '#bdc3c7'},
    {name: 'ASBESTOS', code: '#7f8c8d'},
  ]);

  useEffect(() => {
    async function getRequests() {
      setLoading(true);
      try {
        const response = await api.get('/routes/user');
        setMyRoutes(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    getRequests();
  }, []);

  function renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 1,
            justifyContent: 'center',
            marginRight: 5,
          }}>
          <Image
            source={icons.menu}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            borderRadius: 20,
            width: 280,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '400',
            }}>
            Requests
          </Text>
        </View>
      </View>
    );
  }

  function renderRequests() {
    return (
      <SectionGrid
        itemDimension={90}
        // staticDimension={300}
        // fixed
        // spacing={20}
        sections={[
          {
            title: 'Received',
            data: myRoutes,
            color: '#2ecc71',
          },
          {
            title: 'Sent',
            data: items.slice(6, 12),
            color: '#f1c40f',
          },
        ]}
        style={styles.gridView}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrdersScreen', {
                data: item,
              })
            }>
            <View style={[styles.itemContainer, {backgroundColor: 'white'}]}>
              <View>
                <Text style={styles.itemName}>Start: {item.startLocation}</Text>
                <Text style={styles.itemName}>End: {item.endLocation}</Text>
                <Text style={styles.itemDate}>
                  {Moment(item.startDate).format('lll')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({section}) => (
          <Text
            style={{
              flex: 1,
              fontSize: 20,
              fontWeight: '600',
              alignContent: 'center',
              alignItems: 'center',
              height: 50,
              color: 'white',
              padding: 12,
              backgroundColor: section.color,
            }}>
            {section.title}
          </Text>
        )}
      />
    );
  }

  return (
    <ImageBackground
      style={{flex: 1, resizeMode: 'cover'}}
      source={images.background}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="white"
            style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}
          />
        ) : (
          renderRequests()
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MyRoutesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 25,
    padding: 10,
    height: 100,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemDate: {
    fontSize: 13,
    fontWeight: '600',
  },
  userName: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: '800',
  },
  itemCode: {
    fontWeight: '500',
    fontSize: 12,
    opacity: 0.99,
  },
});
