/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  domStyle,
  domStyleWithUnit,
  domColorStyle,
  nativeComponent,
  style,
} from './decorators';
import BaseViewManager from './BaseViewManager';

function transformToString(transformation) {
  var key = Object.keys(transformation)[0];
  var value = transformation[key];

  switch (key) {
    case 'matrix':
      return `matrix(${value.join(',')})`;
    case 'perspective':
    case 'translateX':
    case 'translateY':
      return `${key}(${value}px)`;
    case 'rotateX':
    case 'rotateY':
    case 'rotate':
    case 'rotateZ':
    case 'skewX':
    case 'skewY':
      return `${key}(${value})`;
    case 'scale':
    case 'scaleX':
    case 'scaleY':
      return `${key}(${value})`;
    case 'translate':
      if (value.length === 3) {
        return `translate3d(${value[0]}, ${value[1]}, ${value[2]})`;
      }
      return `translate(${value[0]}, ${value[1]})`;
    default:
      throw new Error('Invalid transform name: ' + key);
  }
}

@nativeComponent('RCTView')
export default class RCTViewManager extends BaseViewManager {
  createView() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.padding = 0;
    div.style.flexShrink = 0;
    div.style.position = 'relative';
    return div;
  }

  @domStyle
  flex;

  @domStyle
  flexDirection;

  @domStyle
  alignItems;

  @domStyle
  alignSelf;

  @domStyle
  justifyContent;

  @domStyle
  flexGrow;

  @domStyle
  flexShrink;

  @domStyle
  flexBasis;

  @domStyle
  position;

  @domStyle
  opacity;

  @domStyle
  overflow;

  @domStyleWithUnit('px')
  width;

  @domStyleWithUnit('px')
  height;

  @domStyleWithUnit('px')
  left;

  @domStyleWithUnit('px')
  right;

  @domStyleWithUnit('px')
  top;

  @domStyleWithUnit('px')
  bottom;

  @domStyleWithUnit('px')
  borderRadius;

  @domStyleWithUnit('px')
  borderWidth;

  @domStyleWithUnit('px')
  margin;

  @domStyleWithUnit('px')
  marginLeft;

  @domStyleWithUnit('px')
  marginRight;

  @domStyleWithUnit('px')
  marginTop;

  @domStyleWithUnit('px')
  marginBottom;

  @domStyleWithUnit('px')
  padding;

  @domColorStyle
  backgroundColor;

  @domColorStyle
  borderColor;

  @style
  transform(view, value) {
    view.style.transform = value.map(transformToString).join(' ');
  }
}
