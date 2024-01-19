import { Alert, Button, Link, IconButton, AlertColor } from '@mui/material';
import { useLocalStorage } from '@state-less/react-client';
import { createPortal } from 'react-dom';
import { Link as RouterLink } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react-markdown/lib/ast-to-react';

export const Warning = ({
  id,
  severity = 'warning',
  title,
  action,
  children,
  noDismiss = false,
  noPortal = false,
  showMore = true,
  icon,
  sx,
}: {
  id: string;
  severity?: AlertColor;
  title?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  noDismiss?: boolean;
  noPortal?: boolean;
  showMore?: boolean;
  icon?: ReactNode;
  sx?: any;
}) => {
  const [dismissed, setDismissed] = useLocalStorage(id + 'dismissed', false);
  if (dismissed) {
    return null;
  }
  const warning = (
    <Alert
      icon={icon}
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        ...sx,
      }}
      severity={severity}
      action={
        <>
          {action ||
            (showMore && (
              <Button>
                <Link to="/about" component={RouterLink}>
                  More
                </Link>
              </Button>
            ))}
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

  if (noPortal) {
    return warning;
  }
  return createPortal(
    warning,
    document.getElementById('app-warnings') || document.body
  );
};
