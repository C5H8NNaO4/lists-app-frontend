import { format } from 'date-fns';

export const DateFormatter = (formatStr) => (value) => {
  try {
    return format(new Date(value), formatStr);
  } catch (e) {
    return value;
  }
};
