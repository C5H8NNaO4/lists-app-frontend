import {
  Paper,
  Container,
  Button,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Link,
  Pagination,
  Grid,
} from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { FlexBox } from '../../components/FlexBox';
import { useComponent } from '@state-less/react-client';
import { calc } from '../../server-components/examples/VotingApp';
import { Link as RouterLink } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { PAGE_SIZE_POSTS } from '../../lib/const';
import { ViewCounter } from '../../server-components/examples/ViewCounter';
import { FORUM_KEY } from '../../lib/config';
const PAGE_SRC = 'src/pages/States.md';

export const CommunityPage = () => {
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
        {/* <Markdown src={getRawPath(PAGE_SRC)}>*Loading*</Markdown> */}
        <Header />
        <Posts />
      </Paper>
    </Container>
  );
};

const Post = (post) => {
  const [votes, { error, loading }] = useComponent(
    post.children[0]?.component,
    {
      data: post.children[0],
    }
  );
  const { score, upvotes, downvotes } = votes?.props || {};
  const wilson = true,
    random = true;

  const randomUp = useMemo(() => Math.random(), []);
  const randomDown = useMemo(() => Math.random(), []);
  const sum = useMemo(
    () =>
      calc(upvotes, {
        lb: score?.upvote[0],
        ub: score?.upvote[1],
        wilson,
        random,
        r: randomUp,
      }) -
      calc(downvotes, {
        lb: score?.downvote[0],
        ub: score?.downvote[1],
        wilson,
        random,
        r: randomDown,
      }),
    [upvotes, downvotes, score, wilson, random]
  );

  const nAnswers = post.children.filter((c) => c?.props?.body)?.length;
  return (
    <Card
      sx={{
        opacity: post.props.deleted ? 0.9 : 1,
      }}
    >
      <Grid container>
        <Box
          sx={{
            width: '2px',
            backgroundColor: post.props.deleted
              ? 'error.main'
              : post.props.approved
                ? 'success.main'
                : 'warning.main',
          }}
        ></Box>
        <Grid item>
          <FlexBox sx={{ flexDirection: 'column', gap: 1 }}>
            <CardContent
              sx={{ ml: 8, display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              <Chip
                color={sum > 0 ? 'success' : sum < 0 ? 'error' : undefined}
                label={`${sum} votes`}
              />
              <Chip
                color={nAnswers === 0 ? undefined : 'success'}
                label={`${nAnswers} answers`}
              ></Chip>
              <ViewCounter
                componentKey={post?.props?.viewCounter?.component}
                data={post?.props?.viewCounter}
              />
            </CardContent>
          </FlexBox>
        </Grid>
        <Grid item>
          <Box>
            <CardHeader
              title={
                <Link
                  to={`/community/${post.component}`}
                  component={RouterLink}
                >
                  {post.props.title}
                </Link>
              }
              sx={{ pb: 0 }}
            />
            <CardContent
              sx={{
                pt: 0,
                pb: '0rem !important',
                maxHeight: '5rem',
                mb: 2,

                overflow: 'hidden',
              }}
            >
              <Markdown>{post.props.body}</Markdown>
            </CardContent>
            {post.props.tags?.length > 0 && (
              <CardContent sx={{ display: 'flex', gap: 1 }}>
                {post.props.tags?.map((tag) => (
                  <Chip color="info" label={tag} />
                ))}
              </CardContent>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

const Posts = () => {
  const [page, setPage] = useState(1);
  const [component, { error, loading }] = useComponent(FORUM_KEY, {
    props: {
      page: page,
      pageSize: PAGE_SIZE_POSTS,
      compound: false,
    },
  });

  return (
    <FlexBox sx={{ flexDirection: 'column', gap: 1 }}>
      {component?.children?.map((post) => {
        return <Post {...post} />;
      })}
      <Pagination
        count={Math.ceil(component?.props?.totalCount / PAGE_SIZE_POSTS) || 0}
        page={page}
        onChange={(_, p) => setPage(p)}
      />
    </FlexBox>
  );
};
const Header = () => {
  return (
    <FlexBox
      sx={{
        alignItems: 'center',
        flexWrap: 'wrap-reverse',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <Typography variant="h2">Top Questions</Typography>
      <NewPostButton />
    </FlexBox>
  );
};

export const NewPostButton = () => {
  return (
    <Button variant="contained" color="secondary" sx={{ ml: 'auto' }}>
      <Link to="/community/new" component={RouterLink}>
        Ask Question
      </Link>
    </Button>
  );
};
