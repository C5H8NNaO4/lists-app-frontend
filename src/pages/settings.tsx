import {
  Paper,
  Container,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  List,
} from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';
import { useLocalStorage } from '@state-less/react-client';
import { ColorMenu } from '../server-components/examples/Lists';
import PaletteIcon from '@mui/icons-material/Palette';
import { useState } from 'react';

const PAGE_SRC = 'readme/about.md';

export const SettingsPage = () => {
  const [defaultListColor, setDefaultListColor] = useLocalStorage(
    'defaultListColor',
    '#ffffff'
  );
  const [colorMenuOpen, setColorMenuOpen] = useState<HTMLElement | null>(null);
  return (
    <Container maxWidth="lg" disableGutters>
      <Paper
        sx={{
          mt: 1,
          marginBottom: 1,
          padding: {
            xs: 1,
            sm: 4,
            md: 8,
          },
        }}
      >
        <List>
          <ListItem sx={{ backgroundColor: defaultListColor }}>
            <ListItemText
              primary="Default List Color"
              secondary={defaultListColor}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={(e) => setColorMenuOpen(e.target as HTMLElement)}
              >
                <PaletteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Navigation />
        <ColorMenu
          open={colorMenuOpen}
          onClose={() => setColorMenuOpen(null)}
          setColor={setDefaultListColor}
        />
      </Paper>
    </Container>
  );
};
