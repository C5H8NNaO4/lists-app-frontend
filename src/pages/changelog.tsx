import {
  Paper,
  Container,
  Card,
  CardHeader,
  ListItem,
  ListItemText,
  Grid,
  Link,
  Avatar,
} from '@mui/material';

import { Markdown } from '../components/Markdown';
import { getRawPath } from '../components/CollabEditButton';
import { Navigation } from '../components/NavigationButton';
import { useEffect, useState } from 'react';
import Github from 'github-api';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const DAYS_HISTORY = 30;
const PAGE_SRC = 'src/pages/changelog.md';

const commitsToData = (commits) => {
  const data = [
    ...commits,
    {
      dummy: true,
      commit: {
        author: {
          date: new Date(
            +new Date() - DAYS_HISTORY * 60 * 60 * 24 * 1000
          ).toISOString(),
        },
      },
    },
  ].reduce((acc, commit) => {
    const date = new Date(commit?.commit?.author?.date).toDateString();
    const lastDate = acc.at(-1)?.date;
    if (lastDate === date) {
      acc.at(-1).commits++;
      return acc;
    } else {
      const datesBetween = +new Date(lastDate || +new Date()) - +new Date(date);

      const between: any = [];

      const missingDates = Math.floor(datesBetween / (1000 * 60 * 60 * 24));
      for (let i = !lastDate ? 0 : 1; i < missingDates; i++) {
        between.push({
          date: new Date(
            +new Date(lastDate || +new Date()) - i * 1000 * 60 * 60 * 24
          ).toDateString(),
          commits: 0,
        });
      }

      return [...acc, ...between, { date, commits: commit.dummy ? 0 : 1 }];
    }
  }, []);
  return data;
};

export const ChangeLog = () => {
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

        <Markdown># Commits</Markdown>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}>
            <Commits repo={'state-less/react-server'} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Commits repo={'state-less/react-client'} />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Commits repo={'state-less/clean-starter'} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Commits repo={'C5H8NNaO4/react-server-docs'} />
          </Grid>
        </Grid>
        <Navigation />
      </Paper>
    </Container>
  );
};

const Commits = ({ repo }) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const org = repo.split('/')[0].replace('@', '');
  const rep = repo.split('/')[1];
  useEffect(() => {
    (async () => {
      const gh = new Github({
        username: import.meta.env.REACT_APP_GITHUB_USER,
        password: import.meta.env.REACT_APP_GITHUB_TOKEN,
      });
      gh.getRepo(org, rep).listCommits(
        {
          since: new Date(
            +new Date() - DAYS_HISTORY * 60 * 60 * 24 * 1000
          ).toISOString(),
          per_page: 150,
        },
        (err, commits) => {
          setData(commits);
          setLoading(false);
        }
      );
    })();
  }, []);
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ width: 24, height: 24, background: '#FFF', color: '#000' }}
          >
            <GitHubIcon />
          </Avatar>
        }
        title={
          <Link component={RouterLink} to={`https://github.com/${org}/${rep}`}>
            {repo}
          </Link>
        }
      ></CardHeader>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={commitsToData(data).slice().reverse()}>
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#8884d8"
              dot={false}
            />

            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {data.slice(0, 10).map((commit) => {
        const author = commit?.author?.login || commit?.commit?.author?.name;
        const date = commit?.commit?.author?.date;
        return (
          <ListItem dense>
            <ListItemText
              primary={commit?.commit?.message}
              secondary={`${new Date(date).toLocaleDateString()} (${author})`}
            ></ListItemText>
          </ListItem>
        );
      })}
    </Card>
  );
};

const CustomTooltip = (props) => {
  return (
    <Paper
      className="noFocus"
      elevation={1}
      sx={{
        background: '#FFFFFF00',
        backdropFilter: 'blur(2px);',
        '&:hover': {
          background: '#000',
        },
      }}
    >
      {Object.keys(props.payload[0]?.payload || {}).map((key) => {
        return (
          <ListItem dense>
            <ListItemText
              primary={props?.payload?.[0]?.payload?.[key]}
              secondary={key}
            ></ListItemText>
          </ListItem>
        );
      })}
    </Paper>
  );
};
