/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  propSetter, style, domStyle, domStyleWithUnit, domColorStyle, nativeComponent,
  domDirectEvent,
  nativeProp
} from './decorators';
import BaseViewManager from './BaseViewManager';
import RCTViewManager from "./RCTViewManager";

@nativeComponent('RCTText')
export default class RCTTextManager extends RCTViewManager {
  createView(tag) {
    const div = super.createView(tag);
    div.style.display = 'block';
    div.style.fontSize = '12px';
    return div;
  }

  @domStyle
  textAlign;

  @domStyleWithUnit('px')
  fontSize;

  @domColorStyle
  color;
}

@nativeComponent('RCTVirtualText')
export class RCTVirtualTextManager extends RCTTextManager {
  createView(tag) {
    const div = document.createElement(tag || 'span');
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

@nativeComponent('RCTTextInput')
export class RCTTextInputManager extends RCTTextManager {
  createView(tag) {
    const div = super.createView(tag || 'input');
    div.setAttribute('type', 'text');
    div.style.outline = 'none';
    return div;
  }

  @propSetter
  text(view, value) {
    view.value = value;
  }

  @domDirectEvent('focus')
  @nativeProp
  onFocus;

  @domDirectEvent('blur')
  @nativeProp
  onBlur;

  @domDirectEvent('input', ev => ({
    text: ev.target.value,
  }))
  @nativeProp
  onChange;

  @propSetter
  editable(view, value) {
    if (value) {
      view.removeAttribute('disabled');
    } else {
      view.setAttribute('disabled', 'disabled');
    }
  }
}

@nativeComponent('RCTTextArea')
export class RCTTextAreaManager extends RCTTextInputManager {
  createView() {
    const div = super.createView('textarea');
    return div;
  }
}
