/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';

export default class RootViewManager extends BaseViewManager {
  createView() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.height = '100%';
    div.style.flexDirection = 'column';
    div.style.padding = 0;
    return div;
  }

  setViewTag(view, tag) {
    super.setViewTag(view, tag);
    view.setAttribute('data-react-root', tag);
  }
}
