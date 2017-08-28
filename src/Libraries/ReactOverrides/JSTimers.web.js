/**
 * Created by tdzl2003 on 04/06/2017.
 * @providesModule JSTimers
 */

export const setTimeout = originGlobals.setTimeout;
export const clearTimeout = originGlobals.clearTimeout;
export const setInterval = originGlobals.setInterval;
export const clearInterval = originGlobals.clearInterval;

export function setImmediate(fn) {
  return setTimeout(fn, 0);
}

export const clearImmediate = clearTimeout;

global.setImmediate = setImmediate;
global.clearImmediate = clearImmediate;

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

global.requestAnimationFrame = requestAnimationFrame;
global.cancelAnimationFrame = cancelAnimationFrame;