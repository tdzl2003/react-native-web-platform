/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Alert
 * @flow
 */
'use strict';

const NativeModules = require('NativeModules');
const Platform = require('Platform');

const NativeAlert = NativeModules.Alert;

/**
 * Launches an alert dialog with the specified title and message.
 *
 * Optionally provide a list of buttons. Tapping any button will fire the
 * respective onPress callback and dismiss the alert. By default, the only
 * button will be an 'OK' button.
 *
 * This is an API that works both on iOS and Android and can show static
 * alerts. To show an alert that prompts the user to enter some information,
 * see `AlertIOS`; entering text in an alert is common on iOS only.
 *
 * ## iOS
 *
 * On iOS you can specify any number of buttons. Each button can optionally
 * specify a style, which is one of 'default', 'cancel' or 'destructive'.
 *
 * ## Android
 *
 * On Android at most three buttons can be specified. Android has a concept
 * of a neutral, negative and a positive button:
 *
 *   - If you specify one button, it will be the 'positive' one (such as 'OK')
 *   - Two buttons mean 'negative', 'positive' (such as 'Cancel', 'OK')
 *   - Three buttons mean 'neutral', 'negative', 'positive' (such as 'Later', 'Cancel', 'OK')
 *
 * By default alerts on Android can be dismissed by tapping outside of the alert
 * box. This event can be handled by providing an optional `options` parameter,
 * with an `onDismiss` callback property `{ onDismiss: () => {} }`.
 *
 * Alternatively, the dismissing behavior can be disabled altogether by providing
 * an optional `options` parameter with the `cancelable` property set to `false`
 * i.e. `{ cancelable: false }`
 *
 * Example usage:
 * ```
 * // Works on both iOS and Android
 * Alert.alert(
 *   'Alert Title',
 *   'My Alert Msg',
 *   [
 *     {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
 *     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
 *     {text: 'OK', onPress: () => console.log('OK Pressed')},
 *   ],
 *   { cancelable: false }
 * )
 * ```
 */
class Alert {
  static alert(
    title,
    message,
    buttons
  ){
    if (!buttons) {
      NativeAlert.alert(title, message);
    } else if (typeof(buttons) === 'function') {
      NativeAlert.alert(title, message).then(buttons);
    }else if (buttons.length === 1) {
      NativeAlert.alert(title, message).then(() => {
        buttons[0].onPress();
      });
    } else if (buttons.length === 2) {
      NativeAlert.confirm(title, message).then(result => {
        buttons[result ? 1 : 0].onPress();
      });
    } else {
      throw new Error('3 or more buttons is not supported yet.');
    }
  }

  static prompt(
    title,
    message,
    callbackOrButtons,
    type,
    defaultValue,
    keyboardType
  ) {
    NativeAlert.prompt
  }
}

module.exports = Alert;
