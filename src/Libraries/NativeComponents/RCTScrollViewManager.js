/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  domStyle,
  domStyleWithUnit,
  domColorStyle,
  nativeComponent,
  domDirectEvent,
  command,
  directEvent,
} from './decorators';
import BaseViewManager from './BaseViewManager';
import RCTViewManager from "./RCTViewManager";
import IScroll from 'iscroll/build/iscroll-probe';

export function iscrollDirectEvent(eventName, eventWrapper = ev => ({})) {
  return function(target, name, args) {
    directEvent(target, name, args);

    if (target.hasOwnProperty('__iscrollDirectEvent')){
      target.__domDirectEvent[name] = [eventName, eventWrapper];
    } else {
      Object.defineProperty(target, '__iscrollDirectEvent', {
        configurable: true,
        enumerable: false,
        value: {
          [name]: [eventName, eventWrapper],
        },
      })
    }
  }
}

@nativeComponent('RCTScrollView')
class RCTScrollViewManager extends RCTViewManager {

  constructor(bridge) {
    super(bridge);
    if (this.__iscrollDirectEvent) {
      // Copy from prototype.
      this.__props = {...this._props};
      for (const name of Object.keys(this.__iscrollDirectEvent)) {
        const [ eventName, eventWrapper ] = this.__iscrollDirectEvent[name];

        const setter = function (view, value, payload) {
          if (value) {
            const eventHandler = payload.lazyEvents[eventName] = (ev) => {
              const tag = view.getAttribute('data-react-id') | 0;
              bridge.sendEvent(tag, name, eventWrapper(view, payload));
            };
            if (payload.instance) {
              payload.instance.on(eventName, eventHandler);
            }
          } else {
            const eventHandler = payload.lazyEvents[eventName];
            delete payload.lazyEvents[name];
            if (payload.instance) {
              payload.instance.off(eventName, eventHandler);
            }
          }
        };

        this.__props[name] = setter;
      }
    }
  }

  createPayload(view) {
    return {
      lazyEvents: {},
      instance: null,
    };
  }

  @command
  postCreate(view, payload) {
    payload.instance = new IScroll(view, {
      mouseWheel: true,
      probeType: 3,
    });
    for (const key of Object.keys(payload.lazyEvents)) {
      payload.instance.on(key, payload.lazyEvents[key]);
    }
  }

  @iscrollDirectEvent('scroll', function(view, {instance}) {
    return {
      layoutMeasurement: {
        width: view.offsetWidth,
        height: view.offsetHeight,
      },
      contentSize: {
        width: view.firstChild.offsetWidth,
        height: view.firstChild.offsetHeight,
      },
      contentOffset: {
        x: instance.x,
        y: instance.y,
      }
    };
  })
  onScroll;
}

@nativeComponent('RCTScrollContentView')
class RCTScrollContentViewManager extends RCTViewManager {
  setChildren(view, children) {
    super.setChildren(view, children);
    this.refreshParentScroller(view);
  }

  manageChildren(view, moveFrom, moveTo, addChildren, addAtIndecies, removeFrom) {
    const ret = super.manageChildren(view, moveFrom, moveTo, addChildren, addAtIndecies, removeFrom);
    this.refreshParentScroller(view);
    return ret;
  }

  refreshParentScroller(view) {
    const id = view.parentNode && view.parentNode.getAttribute('data-react-id');
    const rec = this.bridge.uiManager.viewRegistry[id];
    if (rec && rec[2] && rec[2].instance) {
      rec[2].instance.refresh();
    }
  }
}
