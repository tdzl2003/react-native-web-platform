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

@nativeComponent('RCTImageView')
export default class RCTImageManager extends BaseViewManager {
  createView() {
    const img = document.createElement('div');
    img.style.display = 'flex';
    img.style.flexDirection = 'column';
    img.style.padding = 0;
    img.style.border = 0;
    img.style.width = 0;
    img.style.height = 0;
    img.style.position = 'relative';
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

  @domStyle
  flex;

  @domStyle
  flexDirection;

  @domStyle
  alignItems;

  @domStyle
  alignSelf;

  @domStyle
  justifyContent;

  @domStyle
  flexGrow;

  @domStyle
  flexShrink;

  @domStyle
  flexBasis;

  @domStyle
  position;

  @domStyle
  opacity;

  @domStyleWithUnit('px')
  width;

  @domStyleWithUnit('px')
  height;

  @domStyleWithUnit('px')
  left;

  @domStyleWithUnit('px')
  right;

  @domStyleWithUnit('px')
  top;

  @domStyleWithUnit('px')
  bottom;

  @domStyleWithUnit('px')
  borderRadius;

  @domStyleWithUnit('px')
  borderWidth;

  @domStyleWithUnit('px')
  margin;

  @domStyleWithUnit('px')
  marginLeft;

  @domStyleWithUnit('px')
  marginRight;

  @domStyleWithUnit('px')
  marginTop;

  @domStyleWithUnit('px')
  marginBottom;

  @domStyleWithUnit('px')
  padding;

  @domColorStyle
  backgroundColor;

  @domColorStyle
  borderColor;
}
