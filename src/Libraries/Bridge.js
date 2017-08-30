/**
 * Created by tdzl2003 on 03/06/2017.
 */
import { moduleClasses } from './NativeModules/decorators';

const BRIDGE_CODE = `
var Status = undefined;

function getOriginPort() {
  const m = /:(\\d+)$/.exec(origin);
  if (m) {
    return +m[1];
  }
  return 80;
}

var __REACT_DEVTOOLS_PORT__ = getOriginPort();

var process = {
  env: {
    NODE_ENV: '${__DEV__ ? 'development' : 'production'}',
  },
};

var originGlobals = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  WebSocket: WebSocket,
};

onmessage = function(e) {
  var msg = e.data;
  if (!msg || !msg.cmd) {
    return;
  }
  if (msg.cmd === 'moduleConfig' ) {
    __fbBatchedBridgeConfig = msg.moduleConfig;
    Status = 'moduleConfig';
  } else
  if (msg.cmd === 'bundle' && Status === 'moduleConfig') {
    try {
      importScripts(msg.bundleName);
      Status = 'bundle';
    } catch (e) {
      console.info('bridge ws:',e.stack);
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", msg.bundleName, true);
      xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4) {
          var result = JSON.parse(xmlhttp.responseText);
          if (result) {
            if (result.type === 'UnableToResolveError' || result.type === 'NotFoundError') {
              console.info('bridge ws:',result.message);
            } else {
              if (result.snippet) {
                // remove all color characters and split the lines for improved clarity
                result.snippet = result.snippet.replace(/\\u001b\\[.*?m/g, '').split('\\n');
              }
              if (result.filename && result.filename.indexOf(':') <= 2) {
                result.filename = 'file:///' + result.filename;
              }
              if (result.errors) {
                for (var i=0; i<result.errors.length; i++) {
                  var error = result.errors[i];
                  if (error.filename && error.filename.indexOf(':') <= 2) {
                    error.filename = 'file:///' + error.filename;
                  }
                }
              }
              console.info('bridge ws:',JSON.stringify(result, undefined, 2));
            }
          }
        }
      }
      xmlhttp.send(null);
    }
  } else if (Status === 'bundle') {
    var results;
    if (msg.cmd === 'exec') {
      results = __fbBatchedBridge.callFunctionReturnFlushedQueue.apply(null, [msg.module, msg.func, msg.args]);
    } else
    if (msg.cmd === 'invoke') {
      results = __fbBatchedBridge.invokeCallbackAndReturnFlushedQueue.apply(null, [msg.id, msg.args]);
    } else
    if (msg.cmd === 'flush') {
      results = __fbBatchedBridge.flushedQueue.apply(null);
    }
    if (results) {
      try {
        postMessage({cmd: 'exec', results: results});
      } catch (e) {
        console.info('bridge ws:',e);
        console.info('bridge ws:',msg);
        console.info('bridge ws:',JSON.stringify(results))
      }
    }
  }
}
`;

function bundleFromRoot(root) {
  let path = location.pathname;
  if (!path.endsWith('/')) {
    // Trim filename
    path = path.substr(0, path.lastIndexOf('/'));
  } else {
    path = path.substr(0, path.length - 1);
  }
  return location.protocol + '//' + location.host + path + '/' + root;
}

function arrayToIds(arr) {
  if (!arr) {
    return arr;
  }
  const ret = [];
  arr.forEach((v, i) => {
    if (v) {
      ret.push(i);
    }
  })
  return ret;
}

function wrapError(error) {
  let ret = {
    message: error.message,
  };
  for (const key of Object.keys(error)) {
    // TODO: check if error[key] is not a simple type.
    ret[key] = error[key];
  }
  return ret;
}

export default class Bridge {
  constructor(bundleUrl) {
    this.bundleUrl = bundleFromRoot(bundleUrl);
    this.moduleInstances = moduleClasses.map(v => new v(this));
    this.moduleConfig = {
      remoteModuleConfig: this.moduleInstances.map(this.createModuleConfig),
    };
  }

  flushTimer = null;

  createModuleConfig = (instance) => {
    return [
      instance.constructor.__reactModuleName || instance.constructor.name,
      instance.constants || null,
      instance.__methods || [],
      arrayToIds(instance.__promiseMethods) || [],
      instance.__syncMethods || [],
    ]
  };

  start() {
    if (global.Worker) {
      const bridgeCodeBlob = new Blob([BRIDGE_CODE]);
      const w = this.worker = new Worker(URL.createObjectURL(bridgeCodeBlob));
      w.postMessage({
        cmd: 'moduleConfig',
        moduleConfig: this.moduleConfig,
      });
      w.postMessage({
        cmd: 'bundle',
        bundleName: this.bundleUrl
      });
      w.onmessage = this.onMessage.bind(this);
    } else {
      // TODO: Implement without worker.
      throw new Error('React-Native-Web-Platform without Worker is not implemented yet.');
    }

    this.flushTimer = requestAnimationFrame(this.requestFlush);
  }

  requestFlush = () => {
    this.worker.postMessage({
      cmd: 'flush',
    });
    this.flushTimer = requestAnimationFrame(this.requestFlush);
  };

  onMessage(e) {
    const msg = e.data;
    if (msg.cmd === 'exec') {
      const [ moduleIds, methodIds, args ] = msg.results;
      for (let i = 0; i < moduleIds.length; i++) {
        const module = this.moduleInstances[moduleIds[i]];
        const methodName = module.__methods[methodIds[i]];
        const isPromise = module.__promiseMethods && (module.__promiseMethods[methodIds[i]]);
        if (isPromise) {
          const failCb = args[i].pop();
          const successCb = args[i].pop();
          const promise = module[methodName].apply(module, args[i]);
          promise.then(
            result => this.invoke(successCb, result),
            error => this.invoke(failCb, wrapError(error)),
          );
          continue;
        }

        module[methodName].apply(module, args[i]);
      }
    }
  }

  invoke(id, ...args) {
    if (this.worker) {
      this.worker.postMessage({
        cmd: 'invoke',
        id,
        args,
      })
    } else {
      // TODO: Implement without worker.
    }
  }

  createRootView(container, appKey, initialProps = null) {
    const rootTag = this.uiManager.createRootView(container);
    this.exec('AppRegistry', 'runApplication', [
      appKey,
      {
        rootTag,
        initialProps,
      },
    ]);
    return () => {
      // TODO: dispose rootView.
    };
  }

  exec(module, func, args) {
    if (this.worker) {
      this.worker.postMessage({
        cmd: 'exec',
        module, func, args
      })
    } else {
      // TODO: Implement without worker.
    }
  }

  sendEvent(tag, type, nativeEvent) {
    this.exec('RCTEventEmitter', 'receiveEvent', [tag, type, nativeEvent]);
  }

  sendTouchEvent(type, touches, changedIndices) {
    this.exec('RCTEventEmitter', 'receiveTouches', [type, touches, changedIndices]);
  }
}
