/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { reactMethod, reactPromiseMethod, reactModule } from './decorators';

@reactModule('DeviceInfo')
export default class DeviceInfo {

  constants = {
    Dimensions: {
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio,
        fontScale: window.devicePixelRatio,
      },
    },
  };
}

