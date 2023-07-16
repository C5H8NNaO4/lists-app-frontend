declare var process: {
  env: {
    REACT_APP_GOOGLE_ID: string;
  };
};
console.log('ENV',import.meta.env);
export const GOOGLE_ID = import.meta.env.REACT_APP_GOOGLE_ID;
