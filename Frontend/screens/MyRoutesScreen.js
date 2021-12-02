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
import Moment from 'moment';
import {SectionGrid} from 'react-native-super-grid';
import {Avatar} from 'react-native-elements';

const MyRoutesScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [myRoutes, setMyRoutes] = useState(null);
  const [sentRequests, setSentRequests] = useState(null);

  useEffect(() => {
    async function getRequests() {
      setLoading(true);
      try {
        const response = await api.get('/routes/user');
        console.log(response.data);
        setMyRoutes(response.data);
        getRequestsSent();
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    async function getRequestsSent() {
      try {
        const response = await api.get('/orders/userId');
        setSentRequests(response.data);
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

  function whatImageToRender(item) {
    if (item.status === 'created') {
      return (
        <Avatar
          source={icons.waiting}
          style={{
            marginTop: 2,
            width: 45,
            height: 45,
          }}
        />
      );
    } else if (item.status === 'cancelled') {
      return (
        <Avatar
          source={images.decline}
          style={{
            marginTop: 2,
            width: 45,
            height: 45,
          }}
        />
      );
    } else {
      return (
        <Avatar
          source={images.accept}
          style={{
            marginTop: 2,
            width: 45,
            height: 45,
          }}
        />
      );
    }
  }

  function renderSentRequests() {
    return (
      <SectionGrid
        itemDimension={90}
        sections={[
          {
            title: 'Sent',
            data: sentRequests, // TODO
            color: '#f1c40f',
          },
        ]}
        style={styles.gridView}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderDetail', {
                data: item,
              })
            }>
            <View style={[styles.itemContainer, {backgroundColor: 'white'}]}>
              <Text style={styles.itemDate}>
                {Moment(item.expiresAt).format('lll')}
              </Text>
              <Text style={styles.itemName}>{item.status.toUpperCase()}</Text>
              {whatImageToRender(item)}
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({section}) => (
          <Text
            style={{
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

  function renderRequests() {
    return (
      <SectionGrid
        itemDimension={90}
        sections={[
          {
            title: 'Received',
            data: myRoutes,
            color: '#2ecc71',
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
              <View style={{alignContent: 'center', alignItems: 'center'}}>
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
          <View style={styles}>
            {renderRequests()}
            {renderSentRequests()}
          </View>
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
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: 140,
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
