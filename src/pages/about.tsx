import { Paper, Container } from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';

const PAGE_SRC = 'readme/about.md';

export const ListsAboutPage = () => {
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
        <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown>
        <Navigation />
      </Paper>
    </Container>
  );
};
