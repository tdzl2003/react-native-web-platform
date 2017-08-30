/**
 * Created by tdzl2003 on 03/06/2017.
 */

import {
  domStyle,
  domStyleWithUnit,
  domColorStyle,
  propSetter,
  nativeComponent,
} from './decorators';
import BaseViewManager from './BaseViewManager';
import RCTViewManager from "./RCTViewManager";

@nativeComponent('RCTImageView')
export default class RCTImageManager extends RCTViewManager {
  createView() {
    const img = super.createView();
    img.style.border = 0;
    img.style.width = 0;
    img.style.height = 0;
    img.style.backgroundSize = '100% 100%'
    return img;
  }

  @propSetter
  source(img, value) {
    img.style.backgroundImage = `url(${value})`;
  };

  @propSetter
  resizeMode(img, value) {
    switch (value) {
      case 'contain': case 'cover':
        img.style.backgroundSize = value;
        img.style.backgroundPosition = 'center';
        img.style.backgroundRepeat = 'no-repeat';
        break;
      case 'stretch':
        img.style.backgroundSize = '100% 100%';
        img.style.backgroundRepeat = 'no-repeat';
        break;
      case 'center':
        img.style.backgroundSize = 'auto';
        img.style.backgroundPosition = 'center';
        img.style.backgroundRepeat = 'no-repeat';
        break;
      case 'repeat':
        img.style.backgroundSize = 'auto';
        img.style.backgroundPosition = 'top left';
        img.style.backgroundRepeat = 'repeat';
        break;
    }
  }
}
