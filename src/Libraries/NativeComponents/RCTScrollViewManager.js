/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  nativeComponent,
  command,
  directEvent,
  nativeProp
} from './decorators';
import RCTViewManager from "./RCTViewManager";
import IScroll from 'iscroll/build/iscroll-probe';

export function iscrollDirectEvent(eventName, eventWrapper = ev => ({})) {
  return function(target, name, args) {
    directEvent(target, name, args);

    if (target.hasOwnProperty('__iscrollDirectEvent')){
      target.__iscrollDirectEvent[name] = [eventName, eventWrapper];
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

export function iscrollProp(targetName) {
  return function (target, name, args) {
    nativeProp(target, name, args);

    const setter = (view, value, payload) => {
      if (payload.instance) {
        console.warn('iScroll props cannot change when created.');
      }
      payload.lazyProperties[targetName] = value;
    };

    if (target.hasOwnProperty('__props')){
      target.__props[name] = setter;
    } else {
      Object.defineProperty(target, '__props', {
        configurable: true,
        enumerable: false,
        value: {
          [name]: setter,
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
      lazyProperties: {},
      lazyEvents: {},
      instance: null,
    };
  }

  @command
  postCreate(view, payload) {
    payload.instance = new IScroll(view, {
      mouseWheel: true,
      probeType: 3,
      scrollbars: true,
      disablePointer: true,
      disableMouse: false,
      disableTouch: false,
      ...payload.lazyProperties,
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

  @iscrollDirectEvent('scrollStart', function(view, {instance}) {
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
  onMomentumScrollBegin;

  @iscrollDirectEvent('scrollEnd', function(view, {instance}) {
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
  onMomentumScrollEnd;

  @iscrollDirectEvent('scrollEnd', function(view, {instance}) {
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
  onScrollAnimationEnd;

  @iscrollProp('snap')
  pagingEnabled;
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
