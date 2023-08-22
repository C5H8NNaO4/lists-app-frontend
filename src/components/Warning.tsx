import { Alert, Button, Link, IconButton } from '@mui/material';
import { useLocalStorage } from '@state-less/react-client';
import { createPortal } from 'react-dom';
import { Link as RouterLink } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export const Warning = ({
  id,
  severity = 'warning',
  title,
  action,
}: {
  id: string;
  severity?: string;
  title?: string;
  action?: React.ReactNode;
}) => {
  const [dismissed, setDismissed] = useLocalStorage(id + 'dismissed', false);
  if (dismissed) {
    return null;
  }
  const warning = (
    <Alert
      sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
      severity={severity}
      action={
        <>
          {action || (
            <Button>
              <Link to="/about" component={RouterLink}>
                More
              </Link>
            </Button>
          )}
          <IconButton onClick={() => setDismissed(true)}>
            <CloseIcon />
          </IconButton>
        </>
      }
    >
      {title ||
        `Please backup / sync your data frequently as there's currently no database
      connected to the server. Data-loss may occur in unexpected circumstances.`}
    </Alert>
  );

  return createPortal(
    warning,
    document.getElementById('app-warnings') || document.body
  );
};
