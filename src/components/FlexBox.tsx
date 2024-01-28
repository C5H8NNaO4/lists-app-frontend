import { Box, BoxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

export const FlexBox = ({
  sx,
  ...rest
}: PropsWithChildren<{ sx?: BoxProps['sx'] }>) => {
  return <Box sx={{ display: 'flex', ...sx }} {...rest} />;
};
