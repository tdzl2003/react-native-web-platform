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
    const text = document.createElement('span');
    return text;
  }

  @propSetter
  text(view, value) {
    while (view.lastChild) {
      view.removeChild(view.lastChild);
    }
    const lines = value.split('\n');
    view.appendChild(document.createTextNode(lines.shift()));
    for (const line of lines) {
      view.appendChild(document.createElement('br'));
      view.appendChild(document.createTextNode(line));
    }
  }
}
