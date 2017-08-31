/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule processTransform
 * @flow
 */
'use strict';

var MatrixMath = require('MatrixMath');
var Platform = require('Platform');

var invariant = require('fbjs/lib/invariant');
var stringifySafe = require('stringifySafe');

/**
 * Generate a transform matrix based on the provided transforms, and use that
 * within the style object instead.
 *
 * This allows us to provide an API that is similar to CSS, where transforms may
 * be applied in an arbitrary order, and yet have a universal, singular
 * interface to native code.
 */
function processTransform(transform: Array<Object>): Array<Object> | Array<number> {
  if (__DEV__) {
    _validateTransforms(transform);
  }

  return transform;
}

function _validateTransforms(transform: Array<Object>): void {
  transform.forEach(transformation => {
    var keys = Object.keys(transformation);
    invariant(
      keys.length === 1,
      'You must specify exactly one property per transform object. Passed properties: %s',
      stringifySafe(transformation),
    );
    var key = keys[0];
    var value = transformation[key];
    _validateTransform(key, value, transformation);
  });
}

function _validateTransform(key, value, transformation) {
  invariant(
    !value.getValue,
    'You passed an Animated.Value to a normal component. ' +
    'You need to wrap that component in an Animated. For example, ' +
    'replace <View /> by <Animated.View />.'
  );

  var multivalueTransforms = [
    'matrix',
    'translate',
  ];
  if (multivalueTransforms.indexOf(key) !== -1) {
    invariant(
      Array.isArray(value),
      'Transform with key of %s must have an array as the value: %s',
      key,
      stringifySafe(transformation),
    );
  }
  switch (key) {
    case 'matrix':
      invariant(
        value.length === 9 || value.length === 16,
        'Matrix transform must have a length of 9 (2d) or 16 (3d). ' +
        'Provided matrix has a length of %s: %s',
        value.length,
        stringifySafe(transformation),
      );
      break;
    case 'translate':
      invariant(
        value.length === 2 || value.length === 3,
        'Transform with key translate must be an array of length 2 or 3, found %s: %s',
        value.length,
        stringifySafe(transformation),
      );
      break;
    case 'rotateX':
    case 'rotateY':
    case 'rotateZ':
    case 'rotate':
    case 'skewX':
    case 'skewY':
      invariant(
        typeof value === 'string',
        'Transform with key of "%s" must be a string: %s',
        key,
        stringifySafe(transformation),
      );
      invariant(
        value.indexOf('deg') > -1 || value.indexOf('rad') > -1,
        'Rotate transform must be expressed in degrees (deg) or radians ' +
        '(rad): %s',
        stringifySafe(transformation),
      );
      break;
    case 'perspective':
      invariant(
        typeof value === 'number',
        'Transform with key of "%s" must be a number: %s',
        key,
        stringifySafe(transformation),
      );
      invariant(
        value !== 0,
        'Transform with key of "%s" cannot be zero: %s',
        key,
        stringifySafe(transformation),
      );
      break;
    case 'translateX':
    case 'translateY':
    case 'scale':
    case 'scaleX':
    case 'scaleY':
      invariant(
        typeof value === 'number',
        'Transform with key of "%s" must be a number: %s',
        key,
        stringifySafe(transformation),
      );
      break;
    default:
      invariant(false, 'Invalid transform %s: %s', key, stringifySafe(transformation));
  }
}

module.exports = processTransform;
