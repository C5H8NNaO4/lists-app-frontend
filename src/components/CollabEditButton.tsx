import { Link as RouterLink } from 'react-router-dom';
import { Button, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export const getRawPath = (path: string) => {
  return `https://raw.githubusercontent.com/state-less/react-server-docs-md/master/${path}`;
};

export const getGHPath = (path: string) => {
  return `https://github.com/state-less/react-server-docs-md/blob/master/${path}`;
};

export const CollabEditButton = ({ to }: { to: string }) => {
  return (
    <Link component={RouterLink} to={to}>
      <Button>
        <EditIcon sx={{ pr: 1 }} />
        Edit this page
      </Button>
    </Link>
  );
};
