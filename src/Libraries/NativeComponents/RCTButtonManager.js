/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { propSetter, domDirectEvent, nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';

@nativeComponent('RCTButton')
export default class RCTButtonManager extends BaseViewManager {
  createView() {
    const button = document.createElement('button');
    button.style.height = '24px';
    button.style.textAlign = 'center';
    button.style.backgroundColor = '#eee';
    return button;
  }

  @propSetter
  title(view, value) {
    view.innerText = value;
  };

  @domDirectEvent('click')
  onPress;

}
