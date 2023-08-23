import { useMediaQuery, useTheme } from '@mui/material';

/**
 * useBreakpoint
 *
 * @returns
 */
const useBreakpoint = () => {
  /**
   * useTheme
   */
  const theme = useTheme();

  /**
   * useMediaQuery
   *
   */
  const mq_xs = useMediaQuery(theme.breakpoints.only('xs'));
  const mq_sm = useMediaQuery(theme.breakpoints.only('sm'));
  const mq_md = useMediaQuery(theme.breakpoints.only('md'));
  const mq_lg = useMediaQuery(theme.breakpoints.only('lg'));
  const mq_xl = useMediaQuery(theme.breakpoints.only('xl'));

  /**
   * getBreakPointName
   *
   */
  const getBreakPointName = () => {
    if (mq_xs) {
      return 'xs';
    }
    if (mq_sm) {
      return 'sm';
    }
    if (mq_md) {
      return 'md';
    }
    if (mq_lg) {
      return 'lg';
    }
    if (mq_xl) {
      return 'xl';
    }
  };

  return {
    getBreakPointName,
  };
};

export default useBreakpoint;
