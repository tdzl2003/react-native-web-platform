/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  domStyle,
  domStyleWithUnit,
  domColorStyle,
  nativeComponent,
} from './decorators';
import BaseViewManager from './BaseViewManager';

@nativeComponent('RCTView')
export default class RCTViewManager extends BaseViewManager {
  createView() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.padding = 0;
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
  padding;

  @domColorStyle
  backgroundColor;

  @domColorStyle
  borderColor;
}
