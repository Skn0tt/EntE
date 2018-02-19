import de from './de';

export interface Translation {
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
    };
    specificEntry: {
      sign: string;
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
  };
}

const lang = (): Translation => de;

export default lang;
