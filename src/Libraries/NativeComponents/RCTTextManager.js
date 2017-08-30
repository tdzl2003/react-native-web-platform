/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { propSetter, style, domStyle, domStyleWithUnit, domColorStyle, nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';
import RCTViewManager from "./RCTViewManager";

@nativeComponent('RCTText')
export default class RCTTextManager extends RCTViewManager {
  createView() {
    const div = super.createView();
    div.style.display = 'block';
    return div;
  }

  @domStyle
  textAlign;

  @domStyleWithUnit('px')
  fontSize;

  @domColorStyle
  color;
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
