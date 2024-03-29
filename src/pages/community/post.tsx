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
  AnswerActions,
  ContentEditor,
  PostActions,
} from '../../server-components/ContentEditor';

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

const DRAFT = true;
const Post = ({ id }) => {
  const [skip, setSkip] = useState(false);
  const [component, { error, loading, refetch }] = useComponent(id);

  useEffect(() => {
    /* Skip recreated ViewCounter component as long as the post is in the cache*/
    if (component?.props) setSkip(true);
  }, [component?.props]);

  const [edit, setEdit] = useState(0);
  const [showDeleted, setShowDeleted] = useLocalStorage(
    'mod-show-deleted',
    false
  );
  const [bodyServer, setBodyServer, { loading: bodyLoading }] = useSyncedState(
    component?.props?.body,
    component?.props?.setBody,
    {
      draft: DRAFT,
    }
  );

  const [body, setBody] = useState(bodyServer);
  useEffect(() => {
    setBody(bodyServer);
  }, [bodyServer]);
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
          <ContentEditor
            draft={DRAFT}
            body={DRAFT ? body : bodyServer}
            component={component}
            edit={edit > 0}
            loading={bodyLoading}
            setBody={DRAFT ? setBody : setBodyServer}
            setEdit={async (e) => {
              if (!e) {
                await setBodyServer(body);
                setEdit(0);
              } else {
                setEdit(2);
              }
            }}
          />
        </FlexBox>
        <PostActions
          draft={DRAFT}
          component={component}
          edit={edit}
          setEdit={async (e) => {
            if (!e) {
              await setBodyServer(body);
              setEdit(0);
            } else {
              setEdit(2);
            }
          }}
        />
        {component?.props.tags?.length > 0 && (
          <CardContent sx={{ display: 'flex', gap: 1 }}>
            {component?.props.tags?.map((tag) => (
              <Chip color="info" label={tag} />
            ))}
          </CardContent>
        )}
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

const Answer = ({ answer }) => {
  const [component, { error, refetch }] = useComponent(answer?.component, {
    data: answer,
  });
  const [edit, setEdit] = useState(0);
  const [bodyServer, setBodyServer, { loading: bodyLoading }] = useSyncedState(
    component?.props?.body,
    component?.props?.setBody
  );

  const [body, setBody] = useState(bodyServer);

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
          <ContentEditor
            draft={DRAFT}
            body={DRAFT ? body : bodyServer}
            component={component}
            edit={edit > 0}
            loading={bodyLoading}
            setBody={DRAFT ? setBody : setBodyServer}
            setEdit={async (e) => {
              if (!e) {
                await setBodyServer(body);
                setEdit(0);
              } else {
                setEdit(2);
              }
            }}
          />
        </Box>
      </FlexBox>

      <AnswerActions
        component={component}
        edit={edit}
        setEdit={setEdit}
        draft={DRAFT}
      />
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
