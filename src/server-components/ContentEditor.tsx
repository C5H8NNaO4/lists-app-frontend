import {
  Button,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';
import { Markdown } from '../components/Markdown';
import { useRef, useState } from 'react';
import { Reactions } from './Reactions';
import { PushPin, PushPinOutlined } from '@mui/icons-material';

export const PostActions = ({ component, edit, setEdit, draft }) => {
  const editTitle = edit === 2 ? 'Save' : edit === 1 ? 'Ok' : 'Edit';

  return (
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
      <SaveButton
        component={component}
        edit={edit}
        title={editTitle}
        setEdit={setEdit}
      />
    </CardActions>
  );
};

export const SaveButton = ({ component, title, edit, setEdit }) => {
  return (
    <>
      {component?.props?.canDelete && (
        <Button
          disabled={component?.props?.deleted}
          key={title}
          onClick={async () => {
            await setEdit(edit === 0 ? 2 : 0);
          }}
        >
          {title}
        </Button>
      )}
    </>
  );
};
export const AnswerActions = ({ component, edit, setEdit, draft }) => {
  return (
    <>
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
          <SaveButton
            component={component}
            edit={edit}
            setEdit={setEdit}
            title={edit > 0 ? (draft ? 'Save' : 'Ok') : 'Edit'}
          />

          <Reactions data={component?.children?.[2]} />
        </CardActions>
      )}
      {!component?.props?.canDelete && (
        <CardActions>
          <Reactions data={component?.children?.[2]} />
        </CardActions>
      )}
    </>
  );
};
export const ContentEditor = ({
  component,
  body,
  setBody,
  edit,
  setEdit,
  loading,
  draft,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Grid container>
        {edit && (
          <Grid item xs={12} md={7}>
            <CardContent sx={{ flex: 1 }}>
              {edit && !component?.props?.deleted && (
                <TextField
                  inputRef={inputRef}
                  inputProps={{
                    onScroll: () => {
                      const scrollPrc =
                        (1 /
                          (inputRef?.current?.getBoundingClientRect()?.height ||
                            0)) *
                        (inputRef?.current?.scrollTop || 0);
                      const contentTop =
                        (contentRef?.current?.getBoundingClientRect()?.height ||
                          0) * scrollPrc;

                      contentRef?.current?.scrollTo({
                        top: contentTop,
                      });
                    },
                  }}
                  color={
                    loading
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
                  rows={(window.innerHeight - 120) / 1.4375 / 16 / 1.5}
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                  }}
                ></TextField>
              )}
            </CardContent>
          </Grid>
        )}
        <Grid item xs={edit ? 12 : 12} md={edit ? 5 : 12}>
          <CardContent
            ref={contentRef}
            sx={{
              flex: 1,
              maxHeight: edit ? (window.innerHeight - 120) / 1.5 : 'unset',
              overflowY: 'scroll',
            }}
          >
            {<Markdown center={false}>{body}</Markdown>}
          </CardContent>
        </Grid>
      </Grid>
    </>
  );
};
