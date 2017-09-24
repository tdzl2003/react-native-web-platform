/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { reactMethod, reactPromiseMethod, reactModule } from './decorators';

@reactModule('Alert')
export default class Alert {

  @reactPromiseMethod
  async alert(title, message) {
    alert(message);
  }

  @reactPromiseMethod
  async confirm(title, message) {
    return confirm(message);
  }
}

