/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import de from "./de";

export interface Translation {
  app: {
    name: string;
  };
  message: {
    sign: {
      error: string;
    };
    request: {
      error: string;
    };
    setPassword: {
      success: string;
      error: string;
    };
    resetPassword: {
      success: string;
    };
  };
  ui: {
    common: {
      close: string;
      submit: string;
    };
    table: {
      search: string;
      sortTooltip: (fieldname: string) => string;
    };
    specificEntry: {
      sign: string;
      unsign: string;
    };
    specificUser: {
      id: string;
      role: string;
      email: string;
      emailTitle: string;
      child: string;
      childrenTitle: string;
      adultTitle: string;
      adult: string;
      notAdult: string;
      refresh: string;
      addChildren: string;
      displaynameTitle: string;
      refreshEmail: string;
      refreshChildren: string;
      refreshDisplayname: string;
    };
    createUser: {
      import: string;
      usernameTitle: string;
      displaynameTitle: string;
      emailTitle: string;
      passwordTitle: string;
    };
    importUsers: {
      dropzone: string;
    };
  };
}

const lang = (): Translation => de;

export default lang;
