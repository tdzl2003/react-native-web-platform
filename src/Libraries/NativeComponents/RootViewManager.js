/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';

function getViewTag(view) {
  while (view) {
    if (view.hasAttribute('data-react-id')) {
      return +view.getAttribute('data-react-id');
    }
    view = view.parentNode;
  }
}

export default class RootViewManager extends BaseViewManager {
  createView() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.height = '100%';
    div.style.flexDirection = 'column';
    div.style.padding = 0;

    div.addEventListener('touchstart', this.onTouchStart);
    div.addEventListener('touchmove', this.onTouchMove);
    div.addEventListener('touchcancel', this.onTouchCancel);
    div.addEventListener('touchend', this.onTouchEnd);
    return div;
  }

  setViewTag(view, tag) {
    super.setViewTag(view, tag);
    view.setAttribute('data-react-root', tag);
  }

  sendTouchEvent(type, ev) {
    const touches = [];
    const touchIdMap = [];
    const changedIndecies = [];

    const reactId = getViewTag(ev.target);
    if (!reactId) {
      // Should not happen.
      return;
    }

    for (const touch of ev.touches) {
      touchIdMap[touch.identifier] = touches.length;
      touches.push({
        pageX: touch.pageX,
        pageY: touch.pageY,
        locationX: touch.locationX,
        locationY: touch.locationY,
        target: reactId,
        identifier: touch.identifier,
      });
    }
    if (type === 'topTouchCancel' || type === 'topTouchEnd') {
      for (const touch of ev.changedTouches) {
        touchIdMap[touch.identifier] = touches.length;
        touches.push({
          pageX: touch.pageX,
          pageY: touch.pageY,
          locationX: touch.locationX,
          locationY: touch.locationY,
          target: reactId,
          identifier: touch.identifier,
        });
      }
    }
    for (const touch of ev.changedTouches) {
      changedIndecies.push(touchIdMap[touch.identifier]);
    }

    this.bridge.sendTouchEvent(type, touches, changedIndecies);
  }

  onTouchStart = (ev) => {
    this.sendTouchEvent('topTouchStart', ev);
  };

  onTouchMove = (ev) => {
    this.sendTouchEvent('topTouchMove', ev);
  };

  onTouchCancel = (ev) => {
    this.sendTouchEvent('topTouchCancel', ev);
  };

  onTouchEnd = (ev) => {
    this.sendTouchEvent('topTouchEnd', ev);
  };
}
