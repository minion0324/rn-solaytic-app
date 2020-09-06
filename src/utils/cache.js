import { isEqual } from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

export const addItemToCache = async (key, id, value) => {
  try {
    const str = await AsyncStorage.getItem(key);
    const data = str ? JSON.parse(str) : [];

    const index = data.findIndex(el => isEqual(el.id, id));
    if (index === -1) {
      data.push({ id, value });
    } else {
      data.splice(index, 1, { id, value });
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    //
  }
};

export const removeItemFromCache = async (key, id) => {
  try {
    const str = await AsyncStorage.getItem(key);
    const data = str ? JSON.parse(str) : [];

    const index = data.findIndex(el => isEqual(el.id, id));
    if (index !== -1) {
      data.splice(index, 1);
    }

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    //
  }
};

export const getCacheItems = async (key) => {
  try {
    const str = await AsyncStorage.getItem(key);
    const data = str ? JSON.parse(str) : [];

    return data;
  } catch (error) {
    return [];
  }
};

export const getCacheIds = async (key) => {
  try {
    const items = await getCacheItems(key);
    const ids = items.map(item => item.id);

    return ids;
  } catch (error) {
    return [];
  }
};
