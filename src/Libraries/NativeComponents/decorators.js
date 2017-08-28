/**
 * Created by tdzl2003 on 03/06/2017.
 */

export const nativeComponentClasses = [];

export function nativeComponent(name) {
  if (typeof(name) === 'function') {
    name.__nativeComponentName = name.__nativeComponentName || name.name;
    nativeComponentClasses.push(name);
    return;
  }
  return function (target) {
    target.__nativeComponentName = name;
    nativeComponentClasses.push(target);
  }
}

export function nativeProp(target, name, args) {
  if (target.hasOwnProperty('__nativeProps')){
    target.__nativeProps[name] = true;
  } else {
    Object.defineProperty(target, '__nativeProps', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: true,
      },
    })
  }
}

export function directEvent(target, name, args) {
  nativeProp(target, name, args);

  if (target.hasOwnProperty('__customDirectEventTypes')){
    target.__customDirectEventTypes[name] = {
      registrationName: name
    };
  } else {
    Object.defineProperty(target, '__customDirectEventTypes', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: {
          registrationName: name
        },
      },
    })
  }
}

export function domDirectEvent(eventName, eventWrapper = ev => ({})) {
  return function(target, name, args) {
    directEvent(target, name, args);

    if (target.hasOwnProperty('__domDirectEvent')){
      target.__domDirectEvent[name] = setter;
    } else {
      Object.defineProperty(target, '__domDirectEvent', {
        configurable: true,
        enumerable: false,
        value: {
          [name]: [eventName, eventWrapper],
        },
      })
    }
  }
}

export function propSetter(target, name, args) {
  nativeProp(target, name, args);

  const setter = args.value;

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

export function prop(target, name, args) {
  nativeProp(target, name, args);

  const setter = (view, value) => {
    view[name] = value;
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

export function style(target, name, args) {
  const setter = args.value;

  if (target.hasOwnProperty('__styles')){
    target.__styles[name] = setter;
  } else {
    Object.defineProperty(target, '__styles', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: setter,
      },
    })
  }
}

export function domStyle(target, name, args) {
  const setter = (view, value) => {
    view.style[name] = value;
  };

  if (target.hasOwnProperty('__styles')){
    target.__styles[name] = setter;
  } else {
    Object.defineProperty(target, '__styles', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: setter,
      },
    })
  }
}

export function domStyleWithUnit(unit) {
  return function(target, name, args) {
    const setter = (view, value) => {
      view.style[name] = `${value}${unit}`;
    };

    if (target.hasOwnProperty('__styles')){
      target.__styles[name] = setter;
    } else {
      Object.defineProperty(target, '__styles', {
        configurable: true,
        enumerable: false,
        value: {
          [name]: setter,
        },
      })
    }
  }
}

export function domColorStyle(target, name, args) {
  const setter = (view, value) => {
    const a = ((value >> 24) & 0xff) / 255;
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = (value & 0xff);
    view.style[name] = `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  if (target.hasOwnProperty('__styles')){
    target.__styles[name] = setter;
  } else {
    Object.defineProperty(target, '__styles', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: setter,
      },
    })
  }
}
