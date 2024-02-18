import {
  Container,
  TextField,
  Button,
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  CardActions,
  Alert,
  LinearProgress,
  IconButton,
  Popover,
  ClickAwayListener,
} from '@mui/material';

import { Markdown } from '../../components/Markdown';
import { FlexBox } from '../../components/FlexBox';
import { useComponent, useLocalStorage } from '@state-less/react-client';
import { UpDownButtons } from '../../server-components/examples/VotingApp';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { NewPost } from './newPost';
import { NewPostButton } from '.';
import { CommunityComments } from '../../server-components/examples/Comments';
import { useSyncedState } from '../../lib/hooks';
import { ViewCounter } from '../../server-components/examples/ViewCounter';
import Visibility from '@mui/icons-material/Visibility';
import {
  AddCircleOutline,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';

const Icons = {
  love: () => <Box sx={{ fontSize: 18, ml: 0.5 }}>❤️</Box>,
  laugh: () => <Box sx={{ fontSize: 18, ml: 0.5 }}>😂</Box>,
  'thumbs-up': () => <Box sx={{ fontSize: 18, ml: 0.5 }}>👍</Box>,
  'thumbs-down': () => <Box sx={{ fontSize: 18, ml: 0.5 }}>👎</Box>,
};

export const PostsPage = (props) => {
  const params = useParams();
  if (params.post === 'new') {
    return <NewPost />;
  }

  return (
    <Container maxWidth="lg" disableGutters sx={{ py: 4 }}>
      <Post id={params.post} />
      <ComposeAnswer id={params.post} />
    </Container>
  );
};

const Post = ({ id }) => {
  const [skip, setSkip] = useState(false);
  const [component, { error, loading, refetch }] = useComponent(id);

  useEffect(() => {
    /* Skip recreated ViewCounter component as long as the post is in the cache*/
    if (component?.props) setSkip(true);
  }, [component?.props]);

  const [edit, setEdit] = useState(false);
  const [showDeleted, setShowDeleted] = useLocalStorage(
    'mod-show-deleted',
    false
  );
  const [body, setBody, { loading: bodyLoading }] = useSyncedState(
    component?.props?.body,
    component?.props?.setBody
  );
  const editTitle = edit ? 'Ok' : 'Edit';
  if (error) return null;
  if (loading)
    return (
      <>
        <Alert severity="info">Loading...</Alert>
        <LinearProgress variant="indeterminate" />
      </>
    );
  return (
    <>
      <FlexBox
        sx={{
          alignItems: 'center',
          height: 'min-content',
          flexWrap: 'wrap-reverse',
        }}
      >
        <CardHeader title={component?.props?.title}></CardHeader>
        <FlexBox
          sx={{
            ml: 'auto',
            mr: { xs: 'auto', sm: 'unset' },
            px: 2,
            flexDirection: { xs: 'column-reverse', sm: 'row' },
          }}
        >
          <IconButton
            color={showDeleted ? 'info' : undefined}
            onClick={() => setShowDeleted(!showDeleted)}
          >
            <Visibility />
          </IconButton>
          <NewPostButton />
        </FlexBox>
      </FlexBox>
      <Card sx={{ mb: 1 }} color="info">
        {component?.props?.deleted && (
          <Alert severity="error">This post has been deleted.</Alert>
        )}
        {!component?.props?.canDelete && !component?.props?.approved && (
          <Alert severity="info">This post needs approval from an admin.</Alert>
        )}
        <FlexBox>
          {component?.children[0] && (
            <UpDownButtons
              data={component?.children[0]}
              id={component?.children[0]?.component}
              wilson={false}
            />
          )}
          <Box sx={{ display: 'flex', width: '100%' }}>
            <CardContent
              sx={{
                flex: 1,
              }}
            >
              {edit && !component?.props?.deleted && (
                <TextField
                  color={
                    bodyLoading
                      ? 'warning'
                      : component?.props?.body === body
                        ? 'success'
                        : 'primary'
                  }
                  multiline
                  fullWidth
                  label={
                    'Body' + (component?.props?.body !== body ? '...' : '')
                  }
                  rows={7}
                  value={body}
                  onChange={(e) => !bodyLoading && setBody(e.target.value)}
                ></TextField>
              )}
              {(!edit || component?.props?.deleted) && (
                <Markdown center={false}>{component?.props?.body}</Markdown>
              )}
            </CardContent>
          </Box>
        </FlexBox>

        {component?.props.tags?.length > 0 && (
          <CardContent sx={{ display: 'flex', gap: 1 }}>
            {component?.props.tags?.map((tag) => (
              <Chip color="info" label={tag} />
            ))}
          </CardContent>
        )}
        <CardActions>
          {component?.props?.canDelete && (
            <Button
              disabled={component?.props?.deleted}
              color="error"
              onClick={() => component.props.del()}
            >
              Delete
            </Button>
          )}
          {!component?.props?.approved &&
            component?.props?.canDelete &&
            !component?.props?.deleted && (
              <Button
                disabled={component?.props?.deleted}
                color="success"
                onClick={() => component.props.approve()}
              >
                Approve
              </Button>
            )}
          {component?.props?.canDelete && !component?.props?.deleted && (
            <Button
              disabled={component?.props?.deleted}
              color={component?.props?.sticky ? 'success' : undefined}
              onClick={() => component.props.toggleSticky()}
            >
              {!component?.props?.sticky ? <PushPinOutlined /> : <PushPin />}
              Sticky
            </Button>
          )}
          {component?.props?.canDelete && (
            <Button
              disabled={component?.props?.deleted}
              key={editTitle}
              onClick={() => setEdit(!edit)}
            >
              {editTitle}
            </Button>
          )}
        </CardActions>
      </Card>
      {component?.props.viewCounter && (
        <ViewCounter componentKey={component?.props.viewCounter?.component} />
      )}
      {component?.children
        .filter(
          (c) => c?.props?.body && (showDeleted ? true : !c?.props?.deleted)
        )
        ?.map((answer) => {
          return <Answer answer={answer} />;
        })}
    </>
  );
};

const Reactions = ({ data }) => {
  const [component, { error, refetch }] = useComponent(data?.component, {
    data,
  });
  const { voted, reactions } = component?.props || {};
  const reactionKeys = Object.keys(component?.props?.reactions || {});
  const [anchor, setAnchor] = useState(false);
  const iconButtonRef = useRef(null);
  return (
    <>
      {reactionKeys
        .filter((key) => reactions[key] > 0 || voted === key)
        .map((reaction) => {
          const Icon = Icons[reaction];
          return (
            <Chip
              icon={<Icon />}
              color={voted === reaction ? 'success' : undefined}
              disabled={voted !== null && voted !== reaction}
              onClick={() => component?.props?.react(reaction)}
              label={reactions[reaction] || '0'}
            />
          );
        })}

      {!voted && (
        <IconButton
          ref={iconButtonRef}
          color={Boolean(anchor) ? 'success' : 'default'}
          onClick={(e) => setAnchor(!anchor)}
        >
          {<AddCircleOutline />}
        </IconButton>
      )}
      <ReactionPopper
        id={`reactions-${component?.key}`}
        anchor={anchor ? iconButtonRef.current : null}
        onClose={() => setAnchor(false)}
        react={component?.props?.react}
      />
    </>
  );
};

const availableReactions = ['love', 'laugh', 'thumbs-up', 'thumbs-down'];
const ReactionPopper = ({ anchor, id, onClose, react }) => {
  return !anchor ? null : (
    <Popover
      id={id}
      open={Boolean(anchor)}
      anchorEl={anchor}
      sx={{ zIndex: 1000000000 }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          {availableReactions.map((reaction) => {
            const Icon = Icons[reaction];
            return (
              <IconButton onClick={() => react(reaction)}>
                {<Icon />}
              </IconButton>
            );
          })}
        </Box>
      </ClickAwayListener>
    </Popover>
  );
};
const Answer = ({ answer }) => {
  const [component, { error, refetch }] = useComponent(answer?.component, {
    data: answer,
  });
  const [edit, setEdit] = useState(false);
  const [body, setBody, { loading }] = useSyncedState(
    component?.props?.body,
    component?.props?.setBody
  );
  return (
    <Card sx={{ mb: 1 }} color="info">
      <FlexBox>
        <UpDownButtons
          id={answer?.children[0]?.component}
          data={answer?.children[0]}
          wilson={false}
        />
        <Box sx={{ width: '100%' }}>
          {component?.props?.deleted && (
            <Alert severity="error">This post has been deleted.</Alert>
          )}
          <CardContent sx={{ flex: 1 }}>
            {edit && !component?.props?.deleted && (
              <TextField
                color={
                  loading
                    ? 'warning'
                    : component?.props?.body === body
                      ? 'success'
                      : 'primary'
                }
                multiline
                fullWidth
                label={'Body' + (component?.props?.body !== body ? '...' : '')}
                rows={7}
                value={body}
                onChange={(e) => !loading && setBody(e.target.value)}
              ></TextField>
            )}
            {(!edit || component?.props?.deleted) && (
              <Markdown center={false}>{component?.props?.body}</Markdown>
            )}
          </CardContent>
        </Box>
      </FlexBox>

      {component?.props?.canDelete && (
        <CardActions
          sx={{
            borderWidth: '0px',
            borderBottomWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'secondary.main',
          }}
        >
          <Button
            disabled={component?.props?.deleted}
            color="error"
            onClick={() => component?.props?.del(!edit)}
          >
            Delete
          </Button>
          <Button
            disabled={component?.props?.deleted}
            onClick={() => setEdit(!edit)}
          >
            {!edit ? 'Edit' : 'Ok'}
          </Button>

          <Reactions data={component?.children?.[2]} />
        </CardActions>
      )}
      {!component?.props?.canDelete && (
        <CardActions>
          <Reactions data={component?.children?.[2]} />
        </CardActions>
      )}
      <CommunityComments id={answer?.children[1]?.component} />
    </Card>
  );
};

const ComposeAnswer = ({ id }) => {
  const [component, { error, loading }] = useComponent(id);
  const [body, setBody] = useState('');
  return (
    <Card sx={{ p: 2 }}>
      <TextField
        multiline
        fullWidth
        label="Answer"
        rows={7}
        onChange={(e) => setBody(e.target.value)}
        value={body}
      />
      <CardActions>
        <Button
          disabled={body.length === 0}
          onClick={async () => {
            setBody('');
            await component?.props?.createAnswer({
              body,
            });
          }}
        >
          Post Answer
        </Button>
      </CardActions>
    </Card>
  );
};
