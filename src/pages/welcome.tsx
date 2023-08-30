import { List, MyLists } from '../server-components/examples/Lists';
import { authContext } from '@state-less/react-client';
import { useContext } from 'react';
import { ListsMeta, Meta } from '../components/Meta';
import { Warning } from '../components/Warning';
import {
  Button,
  IconButton,
  Link,
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';

const PAGE_SRC = 'readme/welcome.md';
export const WelcomePage = () => {
  const ctx = useContext(authContext);
  const navigate = useNavigate();
  return (
    <div>
      <Meta Component={ListsMeta} />
      <Warning
        id="newsletter"
        severity="success"
        title="Signup to our newsletter to receive updates."
        action={
          <>
            <Button
              onClick={() => {
                window.open(
                  'https://mailchi.mp/400c3a137c50/e-mail-newsletter',
                  '_blank'
                );
              }}
            >
              Signup
            </Button>
          </>
        }
      />

      <Container maxWidth="lg" sx={{ minHeight: '100vh' }}>
        <Paper sx={{ mt: 1, p: 4 }}>
          <Typography variant="h2">
            Boost your productivity with Lists. 🥰
          </Typography>
          <Markdown src={getRawPath(PAGE_SRC)}>Loading...</Markdown>
          <Box sx={{ display: 'flex' }}>
            <Button variant="contained" sx={{ mx: 'auto' }}>
              <Link component={RouterLink} to="/" color={'secondary'}>
                Try it now
              </Link>
            </Button>
          </Box>
        </Paper>
        <Grid container spacing={2} sx={{ my: 1 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'row' }}>
              <CardMedia
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  minWidth: 300,
                }}
              >
                <List
                  list="landing-list-1"
                  nItems={5}
                  options={{ hideHUD: true }}
                />
              </CardMedia>
              <CardContent>
                <Typography variant="h4">Simple Lists</Typography>
                <Typography>
                  Enter a title and add different items to your lists by
                  clicking the + button.
                </Typography>
                <Typography>
                  Complete items by clicking the checkmark.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'row' }}>
              <CardMedia
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  minWidth: 300,
                }}
              >
                <List
                  list="landing-list-2"
                  nItems={5}
                  options={{ hideHUD: false }}
                />
              </CardMedia>
              <CardContent>
                <Typography variant="h4">Color your life</Typography>
                <Typography>
                  Select the palette icon to choose a color.
                </Typography>
                <Typography>
                  To delete items, press the edit (pencil) icon and then the red
                  delete icon.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

const FeatureHighlight = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
      <Box>
        <img src="/images/01.png" style={{ height: '40vh' }} />
      </Box>
      <Box>
        <Typography variant="h3">Test</Typography>
        <Typography>Lorem Ipsum</Typography>
      </Box>
    </Box>
  );
};
