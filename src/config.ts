declare var process: {
  env: {
    REACT_APP_GOOGLE_ID: string;
  };
};
export const GOOGLE_ID = import.meta.env.REACT_APP_GOOGLE_ID;
