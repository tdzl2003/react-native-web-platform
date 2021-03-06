/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  domStyle,
  domStyleWithUnit,
  domColorStyle,
  nativeComponent,
  style,
  bubbleEvent,
  propSetter,
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
  createView(tag) {
    const div = document.createElement(tag || 'div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.padding = 0;
    div.style.flexShrink = 0;
    div.style.position = 'relative';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = 0;
    return div;
  }


  @bubbleEvent('onTouchStart', 'onTouchStartCapture')
  topTouchStart;

  @bubbleEvent('onTouchEnd', 'onTouchEndCapture')
  topTouchEnd;

  @bubbleEvent('onTouchCancel', 'onTouchCancelCapture')
  topTouchCancel;

  @bubbleEvent('onTouchMove', 'onTouchMoveCapture')
  topTouchMove;

  @domStyle
  flex;

  @domStyle
  flexGrow;

  @domStyle
  flexBasis;

  @domStyle
  flexShrink;

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

  @domStyle
  borderStyle;

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
  borderTopWidth;

  @domStyleWithUnit('px')
  borderLeftWidth;

  @domStyleWithUnit('px')
  borderRightWidth;

  @domStyleWithUnit('px')
  borderBottomWidth;

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

  @domStyleWithUnit('px')
  paddingLeft;

  @domStyleWithUnit('px')
  paddingRight;

  @domStyleWithUnit('px')
  paddingTop;

  @domStyleWithUnit('px')
  paddingBottom;

  @domColorStyle
  backgroundColor;

  @domColorStyle
  borderColor;

  @domColorStyle
  borderTopColor;

  @domColorStyle
  borderLeftColor;

  @domColorStyle
  borderRightColor;

  @domColorStyle
  borderBottomColor;

  @propSetter
  pointerEvents(view, value) {
    for (const clazz of view.classList.values()) {
      if (clazz.startsWith('pointer-events-')) {
        view.classList.remove(clazz);
      }
    }
    view.classList.add('pointer-events-' + value);
  };

  @style
  transform(view, value) {
    if (value) {
      view.style.transform = value.map(transformToString).join(' ');
    } else {
      view.style.transform = "";
    }
  }
}

