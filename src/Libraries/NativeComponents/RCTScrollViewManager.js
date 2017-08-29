/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  domStyle,
  domStyleWithUnit,
  domColorStyle,
  nativeComponent,
} from './decorators';
import BaseViewManager from './BaseViewManager';
import RCTViewManager from "./RCTViewManager";

@nativeComponent('RCTScrollView')
class RCTScrollViewManager extends RCTViewManager {
}

@nativeComponent('RCTScrollContentView')
class RCTScrollContentViewManager extends RCTViewManager {
}
