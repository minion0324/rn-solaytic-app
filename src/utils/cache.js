import { isEqual } from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

export const addItem = async(key, id, value) => {
  try {
    const str = await AsyncStorage.getItem(key);
    const data = str ? JSON.parse(str) : [];

    console.log('----- before');
    console.log(data);

    const index = data.findIndex(el => isEqual(el.id, id));
    if (index === -1) {
      data.push({ id, value });
    } else {
      data.splice(index, 1, { id, value });
    }

    console.log('----- after');
    console.log(data);

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log('----- add item');
    console.log(error);
  }
};

export const removeItem = async(key, id) => {
  try {
    const str = await AsyncStorage.getItem(key);
    const data = str ? JSON.parse(str) : [];

    const index = data.findIndex(el => isEqual(el.id, id));
    if (index !== -1) {
      data.splice(index, 1);
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log('----- remove item');
    console.log(error);
  }
};

export const getItems = async(key) => {
  try {
    const str = await AsyncStorage.getItem(key);
    const data = str ? JSON.parse(str) : [];

    console.log('----- data');
    console.log(data);

    return data;
  } catch (error) {
    return [];
  }
};
