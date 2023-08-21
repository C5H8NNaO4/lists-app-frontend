import { Routes } from 'react-router';
import ButtonAppBar from '../components/AppBar';
import {
  DarkWaves,
  SunnyBlueClouds,
  VantaBackground,
} from '../components/Background';
import { Actions, stateContext } from '../provider/StateProvider';
import { routes } from '../routes';
import { useContext, useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Link,
  Card,
  CardContent,
  Grid,
  CardHeader,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  LinearProgress,
} from '@mui/material';
import styles from './Layout.module.css';
import { Link as RouterLink } from 'react-router-dom';

import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TwitterIcon from '@mui/icons-material/Twitter';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import GroupsIcon from '@mui/icons-material/Group';
import { useLocation } from 'react-router-dom';
import { SidebarNavigation } from '../components/SidebarNavigation';
import ChatIcon from '@mui/icons-material/Chat';
import Snackbar from '@mui/material/Snackbar';
import HeartIcon from '@mui/icons-material/Favorite';
import { authContext, useComponent } from '@state-less/react-client';
import { ViewCounter } from '../server-components/examples/ViewCounter';

declare let gtag: Function;

const messages = [
  'Building Layout',
  'Loading Animation...',
  'Loading Content...',
  `Notice: This is a pre-alpha version and a work in progress. Features and documentation may not be fully complete. Please use with caution.`,
];

export const Layout = () => {
  const { state, dispatch } = useContext(stateContext);
  const [features, { loading: featuresLoading }] = useComponent('features');
  const [_animated, setAnim] = useState(false);

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (_animated) {
      setTime(1000);
    } else if (time < 1000) {
      setTimeout(setTime, 100, time + 100);
    }
  }, [time, _animated]);

  useEffect(() => {
    setTimeout(() => {
      setAnim(state?.animatedBackground);
    }, 1000);
  }, [state?.animatedBackground]);

  useEffect(() => {
    localStorage.setItem('animatedBackground', features?.props?.animated);
    if (
      features?.props?.animated &&
      !localStorage.getItem('animatedBackgroundUser') &&
      !state.animatedBackground
    ) {
      dispatch({
        type: Actions.TOGGLE_ANIMATED_BACKGROUND,
      });
    }
  }, [features?.props?.animated]);

  const { pathname } = useLocation();
  useEffect(() => {
    gtag('event', 'load', { event_category: 'page' });
  }, [pathname]);

  return (
    <VantaBackground
      light={SunnyBlueClouds}
      dark={DarkWaves}
      enabled={_animated}
    >
      <Box
        key={pathname}
        sx={{
          maxHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 1,
          position: 'relative',
        }}
      >
        {
          <header>
            <ButtonAppBar />
            <LinearProgress
              variant="determinate"
              value={time / 10}
              sx={{ mt: 8 }}
            />
          </header>
        }
        <main>
          <SidebarNavigation />
          {!state.fullscreen && (
            <Alert
              severity="info"
              // sx={{ mt: 8 }}
              action={
                <Button>
                  <Link component={RouterLink} to="/changes">
                    Changes
                  </Link>
                </Button>
              }
            >
              {time < 1000 ? messages[1] : messages[3]}
            </Alert>
          )}
          {state.messages.map((message) => {
            return (
              <Snackbar
                open={true}
                autoHideDuration={6000}
                onClose={() => dispatch({ type: Actions.HIDE_MESSAGE })}
                message={message}
              />
            );
          })}
          <Routes>{routes}</Routes>
        </main>
        {!state.fullscreen && (
          <footer>
            <Paper
              square
              sx={{
                padding: {
                  xs: 0,
                  sm: 1,
                  md: 2,
                },
                mt: 9,
              }}
            >
              <Typography variant="body2" color="textSecondary" align="center">
                © 2023 React Server
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                <Grid item xs={12} sm={6} md={4} xl={2}>
                  <Card sx={{ marginTop: 1 }} elevation={0}>
                    <CardHeader title="Social"></CardHeader>
                    <CardContent>
                      <div className={styles.impressum}>
                        <List disablePadding>
                          <ListItem dense>
                            <ListItemIcon>
                              <GitHubIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://github.com/state-less/react-server"
                              >
                                Github
                              </Link>
                            </ListItemText>
                          </ListItem>

                          <ListItem dense>
                            <ListItemIcon>
                              <TwitterIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://twitter.com/statelesscloud"
                              >
                                Twitter
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <ChatIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://discord.gg/vbEhvfKPFY"
                              >
                                Discord
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <ChatIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="ircs://irc.eu.libera.chat/react-server"
                              >
                                IRC (Libera): #react-server
                              </Link>
                            </ListItemText>
                          </ListItem>
                        </List>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                  <Card sx={{ marginTop: 1 }} elevation={0}>
                    <CardHeader title="Contact"></CardHeader>
                    <CardContent>
                      <div className={styles.impressum}>
                        <List disablePadding>
                          <ListItem dense>
                            <ListItemIcon>
                              <PhoneIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="tel://+4917620350106"
                              >
                                +49 176 20350106
                              </Link>
                            </ListItemText>
                          </ListItem>

                          <ListItem dense>
                            <ListItemIcon>
                              <EmailIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="mailto:moritz.roessler@gmail.com"
                              >
                                moritz.roessler@gmail.com
                              </Link>
                            </ListItemText>
                          </ListItem>
                        </List>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={2}>
                  <Card sx={{ marginTop: 1 }} elevation={0}>
                    <CardHeader title="More"></CardHeader>
                    <CardContent>
                      <div className={styles.impressum}>
                        <List disablePadding>
                          <ListItem dense>
                            <ListItemIcon>
                              <QuestionMarkIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link component={RouterLink} to="/faq">
                                FAQ
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <GroupsIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link component={RouterLink} to="/collaborating">
                                Collaborate
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ListItem dense>
                            <ListItemIcon>
                              <HeartIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <Link
                                component={RouterLink}
                                to="https://github.com/sponsors/state-less"
                              >
                                Sponsor
                              </Link>
                            </ListItemText>
                          </ListItem>
                          <ViewCounter />
                        </List>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </footer>
        )}
      </Box>
    </VantaBackground>
  );
};
