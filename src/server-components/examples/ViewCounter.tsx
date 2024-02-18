import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';

import { useComponent } from '@state-less/react-client';
import {
  Box,
  Tooltip,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';

export type ViewCounterProps = {
  componentKey: string;
  data?: any;
  skip?: boolean;
  variant?: 'chips' | 'plaintext' | 'listitem';
  clientOnly?: boolean;
};

export const ViewCounterSpan = ({ component, clientOnly }) => {
  const clientStr = `${component?.props?.clients} ${clientOnly ? 'views' : 'users'}`;
  const viewsStr = `${component?.props?.views} views`;

  return (
    <div>
      {!clientOnly && <span>{viewsStr}</span>}
      <span>{clientStr}</span>
    </div>
  );
};

export const ViewCounterChip = ({ clientOnly, loading, component }) => {
  const clientStr = `${component?.props?.clients} ${clientOnly ? 'views' : 'users'}`;
  const viewsStr = `${component?.props?.views} views`;
  return (
    <>
      {!clientOnly && (
        <Chip icon={<VisibilityIcon />} label={loading ? '-' : viewsStr} />
      )}
      {<Chip icon={<VisibilityIcon />} label={loading ? '-' : clientStr} />}
    </>
  );
};

export const ViewCounterItem = ({ component, clientOnly, loading }) => {
  return (
    <Tooltip title="Views" placement="left">
      <Box
        sx={{ display: 'flex', justifyContent: 'start', width: 'min-content' }}
      >
        {!clientOnly && (
          <ListItem dense>
            <ListItemIcon>
              <VisibilityIcon />
            </ListItemIcon>
            <ListItemText>
              {loading ? '-' : component?.props?.views}
            </ListItemText>
          </ListItem>
        )}
        <ListItem dense>
          <ListItemIcon>
            {clientOnly ? <VisibilityIcon /> : <GroupIcon />}
          </ListItemIcon>
          <ListItemText>
            {loading ? '-' : component?.props?.clients}
          </ListItemText>
        </ListItem>
      </Box>
    </Tooltip>
  );
};

export const ViewCounter = ({
  componentKey,
  data,
  skip,
  variant,
  clientOnly,
}: ViewCounterProps) => {
  const [component, { loading }] = useComponent(componentKey, {
    skip,
    data,
  });

  const props = { clientOnly, component, loading };

  if (variant === 'plaintext') return <ViewCounterSpan {...props} />;
  if (variant === 'chips') return <ViewCounterChip {...props} />;
  return <ViewCounterItem {...props} />;
};
