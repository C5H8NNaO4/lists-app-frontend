import { List, MyLists } from '../server-components/examples/Lists';
import { authContext, useComponent } from '@state-less/react-client';
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
  CardHeader,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { ExampleChart } from '../components/charts/ExampleChart';

const PAGE_SRC = 'readme/welcome.md';

export const WelcomePage = () => {
  const ctx = useContext(authContext);
  const navigate = useNavigate();
  const [component, { loading }] = useComponent('landing-list-3');
  const data = Object.values(
    component?.children
      ?.map((counter) => {
        return {
          date: counter?.props?.archived,
          [counter.props.title]: counter?.props?.count,
        };
      })
      .reduce(
        (acc, cur) => ({ ...acc, [cur.date]: { ...acc[cur.date], ...cur } }),
        {}
      ) || {}
  );
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
            <Link
              component={RouterLink}
              sx={{ mx: 'auto', color: 'success.main' }}
              to="/"
            >
              <b>Try it now</b>
            </Link>
          </Box>
        </Paper>

        <Grid container spacing={2} sx={{ my: 1 }}>
          <Grid item xs={12} lg={6}>
            <Card>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
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
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CardHeader title="Simple Lists"></CardHeader>
                  <CardContent>
                    <Typography>
                      Enter a title and add different items to your lists by
                      clicking the + button.
                    </Typography>
                    <Typography>
                      Complete items by clicking the checkmark.
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
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
                </Grid>
                <Grid item xs={12} lg={6}>
                  <CardHeader title="Color your life"></CardHeader>
                  <CardContent>
                    <Typography>
                      Select the palette icon to choose a color.
                    </Typography>
                    <Typography>
                      To delete items, press the edit (pencil) icon and then the
                      red delete icon.
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item container xs={12} spacing={2}>
            <Grid item xs={12} lg={6}>
              <Card>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <CardMedia
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        minWidth: 300,
                      }}
                    >
                      <List list="landing-list-3" nItems={5} />
                    </CardMedia>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <CardHeader title="Track your history"></CardHeader>
                    <CardContent>
                      <Typography>
                        Once you have added a few items, you can track your
                        consumption over time using the analytics feature.
                        Correlate mood with coffee intake, activity and whatever
                        else you want to track.
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <ExampleChart data={data} />
            </Grid>
          </Grid>
        </Grid>
        <Paper sx={{ display: 'flex', mt: 1 }}>
          <video
            autoPlay
            muted
            style={{ width: '100%' }}
            src="/demo.mp4"
            loop
          ></video>
        </Paper>
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
