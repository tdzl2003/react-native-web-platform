/**
 * Created by tdzl2003 on 03/06/2017.
 */

export function reactMethod(target, name, args) {
  if (target.hasOwnProperty('__methods')){
    target.__methods.push(name);
  } else {
    Object.defineProperty(target, '__methods', {
      configurable: true,
      enumerable: false,
      value: [name],
    })
  }
}

export function reactPromiseMethod(target, name, args) {
  reactMethod(target, name, args);
  let methodId = target.__methods.length - 1;

  if (!target.hasOwnProperty('__promiseMethods')){
    Object.defineProperty(target, '__promiseMethods', {
      configurable: true,
      enumerable: false,
      value: [],
    })
  }
  target.__promiseMethods[methodId] = true;
}

export const moduleClasses = [];

export function reactModule(name) {
  if (typeof(name) === 'function') {
    name.__reactModuleName = name.__reactModuleName || name.name;
    moduleClasses.push(name);
    return;
  }
  return function (target) {
    target.__reactModuleName = name;
    moduleClasses.push(target)
  }
}
