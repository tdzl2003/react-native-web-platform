/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setupDevtools
 * @flow
 */
'use strict';

if (__DEV__) {
  // This will not work.
  // We need to rewrite tool connector with __REACT_DEVTOOLS_GLOBAL_HOOK__.
  // It should not connect with websocket.
}
