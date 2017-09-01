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

    if ('ontouchstart' in window) {
      div.addEventListener('touchstart', this.onTouchStart);
      div.addEventListener('touchmove', this.onTouchMove);
      div.addEventListener('touchcancel', this.onTouchCancel);
      div.addEventListener('touchend', this.onTouchEnd);
    } else {
      div.addEventListener('mousedown', this.onMouseDown);
      div.addEventListener('mouseover', this.onMouseMove);
      div.addEventListener('mouseup', this.onMouseUp);
    }
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

    const reactId = ev.target.getAttribute('data-react-id') | 0;

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

  isMouseDown = true;

  onMouseDown = (ev) => {
    if (ev.button === 0) {
      this.isMouseDown = true;
      this.sendMouseEvent('topTouchStart', ev);
    }
  }

  onMouseMove = (ev) => {
    if (this.isMouseDown) {
      this.sendMouseEvent('topTouchMove', ev);
    }
  };

  onMouseUp = (ev) => {
    if (ev.button === 0) {
      this.isMouseDown = false;
      this.sendMouseEvent('topTouchEnd', ev);
    }
  };

  sendMouseEvent(type, ev) {
    const reactId = ev.target.getAttribute('data-react-id') | 0;
    const touches = [{
      pageX: ev.pageX,
      pageY: ev.pageY,
      locationX: ev.locationX,
      locationY: ev.locationY,
      target: reactId,
      identifier: 0,
    }];
    const changedIndecies = [0];

    this.bridge.sendTouchEvent(type, touches, changedIndecies);
  }
}
