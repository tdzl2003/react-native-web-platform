/**
 * Created by tdzl2003 on 10/06/2017.
 */


import {reactModule} from "./decorators";

@reactModule('TouchEventDispatcher')
export default class TouchEventDispatcher {
  constructor(bridge) {
    this.bridge = bridge;

    document.body.addEventListener('touchstart', (ev) => {
      this.dispatchTouchEvent('topTouchStart', ev);
    });

    document.body.addEventListener('touchmove', (ev) => {
      this.dispatchTouchEvent('topTouchMove', ev);
    });

    document.body.addEventListener('touchcancel', (ev) => {
      this.dispatchTouchEvent('topTouchCancel', ev);
    });

    document.body.addEventListener('touchend', (ev) => {
      this.dispatchTouchEvent('topTouchEnd', ev);
    });
  }

  getReactId(target) {
    for (;;target = target.parentNode) {
      if (target.hasAttribute('data-react-id')) {
        return target.getAttribute('data-react-id') | 0;
      }
      if (!target.parentNode || target === document.body) {
        return -1;
      }
    }
  }

  dispatchTouchEvent(type, ev) {
    const timestamp = Date.now();
    touches = [].map.call(type == 'topTouchCancel' || type == 'topTouchEnd' ? ev.changedTouches :ev.touches, touch => {
      const { target } = touch;

      return ({
        pageX: touch.pageX,
        pageY: touch.pageY,

        // TODO: get view coordinate to compute location position
        locationX: 0,
        locationY: 0,

        timestamp,
        target: this.getReactId(target),
        identifier: touch.identifier,
      })
    });
    changedIndecies = [].map.call(ev.changedTouches, touch => {
      return touches.findIndex(v => v.identifier === touch.identifier);
    });
    this.bridge.exec('RCTEventEmitter', 'receiveTouches', [
      type, touches, changedIndecies,
    ]);
  }
}
