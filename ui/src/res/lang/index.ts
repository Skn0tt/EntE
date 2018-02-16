import de from './de';

export interface Translation {
  message: {
    sign: {
      error: string;
    },
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
    specificEntry: {
      sign: string;
    };
  };
}

const lang = (): Translation => de;

export default lang;
