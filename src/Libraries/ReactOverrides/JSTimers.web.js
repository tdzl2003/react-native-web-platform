/**
 * Created by tdzl2003 on 04/06/2017.
 * @providesModule JSTimers
 */
'use strict';

export const setTimeout = originGlobals.setTimeout;
export const clearTimeout = originGlobals.clearTimeout;
export const setInterval = originGlobals.setInterval;
export const clearInterval = originGlobals.clearInterval;

const framesCallbacks = [];

setInterval(() => {
  for (const timer of framesCallbacks.splice(0)) {
    if (!timer.canceled) {
      timer.f();
    }
  }
}, 16);

export function requestAnimationFrame(fn) {
  const ret = new Timer(fn);
  framesCallbacks.push(ret);
  return ret;
}

export function cancelAnimationFrame(timer) {
  if (timer instanceof Timer) {
    timer.canceled = true;
  }
}

let immediates = [];

class Timer {
  f;
  canceled = false;

  constructor(f) {
    this.f = f;
  }
}

export function setImmediate(func, ...args) {
    const ret = new Timer(()=>func(...args));
    immediates.push(ret);
    return ret;
}

export function clearImmediate(ev) {
  if (ev instanceof Timer) {
    ev.canceled = true;
  }
}

global.setImmediate = setImmediate;
global.clearImmediate = clearImmediate;

export function callImmediates() {
    for (;;) {
      const pass = immediates.splice(0);
      if (pass.length === 0) {
        break;
      }
      for (const ev of pass) {
        if (!ev.canceled) {
          ev.f();
        }
      }
    }
}

global.requestAnimationFrame = requestAnimationFrame;
global.cancelAnimationFrame = cancelAnimationFrame;
