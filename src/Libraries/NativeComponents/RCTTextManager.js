/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { propSetter, style, domStyle, domStyleWithUnit, nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';

@nativeComponent('RCTText')
export default class RCTTextManager extends BaseViewManager {
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
  position;

  @domStyleWithUnit('px')
  left;

  @domStyleWithUnit('px')
  right;

  @domStyleWithUnit('px')
  top;

  @domStyleWithUnit('px')
  bottom;

  @style
  backgroundColor(view, value) {
    const a = ((value >> 24) & 0xff) / 255;
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = (value & 0xff);
    view.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
  };

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
    // view.setAttribute('data-react-id', tag);
  }
}