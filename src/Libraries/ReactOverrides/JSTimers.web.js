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
      timer.fn();
    }
  }
}, 16);

export function requestAnimationFrame(fn) {
  const ret = {fn};
  framesCallbacks.push(ret);
  return ret;
}

export function cancelAnimationFrame(timer) {
  timer.canceled = true;
}

let immediates = [];

export function setImmediate(func, ...args) {
    const ret = immediates.length;
    immediates.push({
        f:()=>func(...args),
        canceled: false,
    });
}

export function clearImmediate(ev) {
  ev.canceled = true;
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