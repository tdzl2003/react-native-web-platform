import { reactPromiseMethod, reactModule } from './decorators';

import _ from 'lodash';

const mergeLocalStorageItem = (key, value) => {
  const oldValue = window.localStorage.getItem(key);
  const oldObject = JSON.parse(oldValue);
  const newObject = JSON.parse(value);
  const nextValue = JSON.stringify(_.merge({}, oldObject, newObject));
  window.localStorage.setItem(key, nextValue);
};

const promisify = (getValue) => {
  return new Promise((resolve, reject) => {
    try {
      const value = getValue();
      resolve(value);
    } catch (err) {
      reject(err);
    }
  });
};

const promisifyAll = (promises, processResult) => {
  return Promise.all(promises).then(
    result => {
      return processResult ? processResult(result) : null;
    },
    // errors => {
    //   return Promise.reject(errors);
    // }
  );
};

@reactModule('AsyncLocalStorage')
export default class AsyncLocalStorage {
  @reactPromiseMethod
  clear() {
    return promisify(() => {
      window.localStorage.clear();
    });
  }

  @reactPromiseMethod
  getAllKeys() {
    return promisify(() => {
      const numberOfKeys = window.localStorage.length;
      const keys = [];
      for (let i = 0; i < numberOfKeys; i += 1) {
        const key = window.localStorage.key(i);
        keys.push(key);
      }
      return keys;
    });
  }

  @reactPromiseMethod
  multiGet(keys) {
    // const promises = keys.map(key => this.getItem(key));
    // const processResult = result => result.map((value, i) => [keys[i], value]);
    // return promisifyAll(promises, processResult);
    const result = keys.map(key => [key, window.localStorage.getItem(key)]);
    return Promise.resolve(result);
  }

  // @reactPromiseMethod
  // getItem(key) {
  //   return promisify(() =>
  //     window.localStorage.getItem(key)
  //   );
  // }

  // @reactPromiseMethod
  // setItem(key, value) {
  //   return promisify(() =>
  //     window.localStorage.setItem(key, value)
  //   );
  // }

  @reactPromiseMethod
  multiSet(keyValuePairs) {
    // const promises = keyValuePairs.map(item => this.setItem(item[0], item[1]));
    // return promisifyAll(promises);

    keyValuePairs.map(([key, value]) => window.localStorage.setItem(key, value));
    return Promise.resolve(null);
  }

  @reactPromiseMethod
  mergeItem(key, value) {
    return promisify(() => {
      mergeLocalStorageItem(key, value);
    });
  }

  @reactPromiseMethod
  multiMerge(keyValuePairs) {
    const promises = keyValuePairs.map(item => this.mergeItem(item[0], item[1]));
    return promisifyAll(promises);
  }

  @reactPromiseMethod
  removeItem(key) {
    return promisify(() => {
      return window.localStorage.removeItem(key);
    });
  }

  @reactPromiseMethod
  multiRemove(keys) {
    const promises = keys.map(key => this.removeItem(key));
    return promisifyAll(promises);
  }
};

module.exports = AsyncLocalStorage;