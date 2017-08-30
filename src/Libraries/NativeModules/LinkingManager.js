/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { reactMethod, reactPromiseMethod, reactModule } from './decorators';

@reactModule('LinkingManager')
export default class LinkingManager {

  @reactPromiseMethod
  async openUrl(url) {
    window.open(url, '_blank');
  }

  @reactPromiseMethod
  async canOpenUrl(url) {
    return true;
  }

  @reactPromiseMethod
  getInitialURL() {
    return null;
  }

}

