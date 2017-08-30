/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { propSetter, style, domStyle, domStyleWithUnit, domColorStyle, nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';

@nativeComponent('RCTText')
export default class RCTTextManager extends BaseViewManager {
  createView() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.padding = 0;
    div.style.position = 'relative';
    return div;
  }

  @domStyle
  flex;

  @domStyle
  position;

  @domStyle
  textAlign;

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
  left;

  @domStyleWithUnit('px')
  right;

  @domStyleWithUnit('px')
  top;

  @domStyleWithUnit('px')
  bottom;

  @domStyleWithUnit('px')
  fontSize;

  @domColorStyle
  color;

  @domColorStyle
  backgroundColor;
}

@nativeComponent('RCTRawText')
export class RCTRawTextManager extends BaseViewManager {
  createView() {
    const text = document.createTextNode('');
    return text;
  }

  @propSetter
  text(view, value) {
    view.data = value;
  }

  setViewTag(view, tag) {
  }
}
