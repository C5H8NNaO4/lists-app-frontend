import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useComponent } from '@state-less/react-client';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useMemo } from 'react';

export const calc = (
  votes = 0,
  { lb = 0, ub = 0, random = false, wilson = true, r }
) => {
  const diff = ub - lb;
  const lbv = Math.round(lb * votes);
  const rand = Math.round(r * diff * votes);
  return (wilson ? lbv : votes) + (random ? rand : 0);
};

type VotingServerProps = {
  upvotes: number;
  downvotes: number;
  voted: number;
  policies: string[];
  score: {
    upvote: [number, number];
    downvote: [number, number];
  };
  upvote: () => void;
  downvote: () => void;
};

export const UpDownButtons = ({
  random,
  wilson,
  data,
  id = 'votings',
}: {
  random?: boolean;
  wilson?: boolean;
  hideVotes?: boolean;
  data: { props: VotingServerProps };
  id?: string;
}) => {
  const [component, { loading, error }] = useComponent(id, {
    data,
  });
  const { score, upvotes, downvotes, voted, policies } = component?.props || {};
  const randomUp = useMemo(() => Math.random(), []);
  const randomDown = useMemo(() => Math.random(), []);
  const sum = useMemo(() => {
    return (
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
      })
    );
  }, [upvotes, downvotes, score, wilson, random]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <IconButton
        color={voted === 1 ? 'success' : 'default'}
        onClick={() => component?.props.upvote()}
        disabled={voted === -1 && policies.includes('single-vote')}
      >
        <KeyboardArrowUpIcon />
      </IconButton>
      {loading ? <CircularProgress size="1rem"></CircularProgress> : sum}
      <IconButton
        color={voted === -1 ? 'error' : 'default'}
        onClick={() => component?.props.downvote()}
        disabled={voted === 1 && policies.includes('single-vote')}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
    </Box>
  );
};

export const UpButton = ({
  random,
  wilson,
  id = 'votings',
}: {
  random?: boolean;
  wilson?: boolean;
  hideVotes?: boolean;
  id?: string;
}) => {
  const [component, { loading, error }] = useComponent(id, {});
  const { score, upvotes, downvotes, voted, policies } = component?.props || {};
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'start',
        mr: 1,
      }}
    >
      <IconButton
        sx={{ p: 0 }}
        color={voted === 1 ? 'success' : 'default'}
        onClick={() => component?.props.upvote()}
        disabled={voted === -1 && policies.includes('single-vote')}
      >
        <KeyboardArrowUpIcon />
      </IconButton>
      {loading ? <CircularProgress size={'14px'} /> : sum}
    </Box>
  );
};
export const VotingApp = ({
  random,
  wilson,
  id = 'votings',
  hideVotes = false,
}: {
  random?: boolean;
  wilson?: boolean;
  hideVotes?: boolean;
  id?: string;
}) => {
  const [component, { loading, error }] = useComponent(id, {});
  const { score, upvotes, downvotes, voted, policies } = component?.props || {};

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
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={'center'}
        flexDirection={'row'}
        sx={{ my: 2 }}
      >
        {hideVotes ? (
          <IconButton
            color="success"
            onClick={() => component?.props.upvote()}
            disabled={voted === -1 && policies.includes('single-vote')}
          >
            <ThumbUpIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => component?.props.upvote()}
            disabled={voted === -1 && policies.includes('single-vote')}
            startIcon={<ThumbUpIcon />}
          >
            {upvotes || 0}
          </Button>
        )}
        <Typography variant="h5" align="center" sx={{ mx: 2 }}>
          {sum}
        </Typography>
        {hideVotes ? (
          <IconButton
            color="error"
            onClick={() => component?.props.downvote()}
            disabled={voted === 1 && policies.includes('single-vote')}
          >
            <ThumbDownIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={() => component?.props.downvote()}
            disabled={voted === 1 && policies.includes('single-vote')}
            endIcon={<ThumbDownIcon />}
          >
            {downvotes || 0}
          </Button>
        )}
      </Box>
    </>
  );
};
