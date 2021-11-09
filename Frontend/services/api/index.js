import AsyncStorage from '@react-native-community/async-storage';
import {create} from 'apisauce';

const api = create({
  baseURL: 'http://www.mobillity-app-dev.club/api',
});

api.addAsyncRequestTransform(request => async () => {
  const token = await AsyncStorage.getItem('@App:token');

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
});

api.addResponseTransform(response => {
  if (!response.ok) {
    throw response;
  }
});

export default api;
