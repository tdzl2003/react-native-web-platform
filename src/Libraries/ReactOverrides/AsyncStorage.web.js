/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AsyncStorage
 * @noflow
 * @flow-weak
 * @jsdoc
 */
'use strict';

const NativeModules = require('NativeModules');

const RCTAsyncStorage = NativeModules.AsyncLocalStorage;


var AsyncStorage = {

getItem: function(
  key: string
): Promise {
  return RCTAsyncStorage.multiGet([key]).then(result => {
    let ret =
      (result && result[0] && result[0][1]) ? result[0][1] : null;
    return ret;
  }
  );
},

setItem: function(
  key: string,
  value: string
): Promise {
  return RCTAsyncStorage.multiSet([[key, value]]);
},

removeItem: function(
  key: string
): Promise {
  return RCTAsyncStorage.multiRemove([key]);
},

mergeItem: function(
  key: string,
  value: string,
): Promise {
  return RCTAsyncStorage.multiMerge([[key,value]]);
},


clear(): Promise {
  return RCTAsyncStorage.clear();
},

getAllKeys(): Promise {
  return RCTAsyncStorage.getAllKeys();
},

multiGet: function(
  keys: Array<string>,
): Promise {
  return new RCTAsyncStorage.multiGet(keys);
},

multiSet: function(
  keyValuePairs: Array<Array<string>>,
): Promise {
  return new RCTAsyncStorage.multiSet(keyValuePairs);
},

multiRemove: function(
  keys: Array<string>,
): Promise {
  return RCTAsyncStorage.multiRemove(keys);
},

multiMerge: function(
  keyValuePairs: Array<Array<string>>
): Promise {
  return RCTAsyncStorage.multiMerge(keyValuePairs);
},
};
module.exports = AsyncStorage;
