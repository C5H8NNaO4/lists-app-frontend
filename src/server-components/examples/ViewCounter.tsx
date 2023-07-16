import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';

import { useComponent } from '@state-less/react-client';
import {
  Box,
  Tooltip,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';

export const ViewCounter = () => {
  const [component, { error, loading }] = useComponent('view-counter', {});

  return (
    <Tooltip title="Views" placement="left">
      <Box sx={{ display: 'flex' }}>
        <ListItem dense>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          <ListItemText>{loading ? '-' : component?.props?.views}</ListItemText>
        </ListItem>
        <ListItem dense>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText>
            {loading ? '-' : component?.props?.clients}
          </ListItemText>
        </ListItem>
      </Box>
    </Tooltip>
  );
};
