import { Link as RouterLink } from 'react-router-dom';
import { Button, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export const getRawPath = (path: string) => {
  return `https://raw.githubusercontent.com/C5H8NNaO4/lists-app-frontend/master/${path}`;
};

export const getGHPath = (path: string) => {
  return `https://github.com/C5H8NNaO4/lists-app-frontend/blob/master/${path}`;
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
