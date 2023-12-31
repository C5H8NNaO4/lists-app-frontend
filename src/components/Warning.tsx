import { Alert, Button, Link, IconButton, AlertColor } from '@mui/material';
import { useLocalStorage } from '@state-less/react-client';
import { createPortal } from 'react-dom';
import { Link as RouterLink } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export const Warning = ({
  id,
  severity = 'warning',
  title,
  action,
  children,
  noDismiss = false,
  sx,
}: {
  id: string;
  severity?: AlertColor;
  title?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  noDismiss?: boolean;
  sx?: any;
}) => {
  const [dismissed, setDismissed] = useLocalStorage(id + 'dismissed', false);
  if (dismissed) {
    return null;
  }
  const warning = (
    <Alert
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...sx,
      }}
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
          {!noDismiss && (
            <IconButton onClick={() => setDismissed(true)}>
              <CloseIcon />
            </IconButton>
          )}
        </>
      }
    >
      {title || children}
    </Alert>
  );

  return createPortal(
    warning,
    document.getElementById('app-warnings') || document.body
  );
};
