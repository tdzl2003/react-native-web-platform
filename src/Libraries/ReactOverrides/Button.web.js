/**
 * Created by tdzl2003 on 04/06/2017.
 * @providesModule Button
 */
import {
  requireNativeComponent
} from 'react-native';

import React, { PropTypes } from 'React';

const ColorPropType = require('ColorPropType');

const Button = requireNativeComponent('RCTButton', {
  propTypes: {
    title: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    color: ColorPropType,
  },
});

module.exports = Button;
