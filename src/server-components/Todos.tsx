/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  IconButton,
  List as MUIList,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  CardContent,
  CardMedia,
  CardActions,
  Alert,
  Grid,
  InputAdornment,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useComponent } from '@state-less/react-client';
import { useContext, useEffect, useRef, useState } from 'react';
import IconMore from '@mui/icons-material/Add';
import IconClear from '@mui/icons-material/Clear';
import { Actions, stateContext } from '../provider/StateProvider';

export const MyLists = (props) => {
  const [component, { loading, error }] = useComponent('my-lists', {});
  const { state, dispatch } = useContext(stateContext);

  useEffect(() => {
    const onKeyUp = (e) => {
      console.log('KEY UP', e);
      if (e.key === 'z' && e.ctrlKey) {
        const lastAction = state.history.at(-1);
        console.log('LAST ACTION', lastAction);
        lastAction?.reverse();
        dispatch({ type: Actions.REVERT_CHANGE });
      }
    };
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [state]);

  return (
    <div>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Grid container spacing={1}>
        {component?.children?.map((list, i) => {
          return (
            <Grid item sm={12} md={4}>
              <List key={list.key} list={`${list.key}`}>
                {' '}
              </List>
            </Grid>
          );
        })}
        <Grid item sm={12} md={4}>
          <NewListSkeleton onAdd={() => component?.props?.add()} />
        </Grid>
      </Grid>
    </div>
  );
};

export const NewListSkeleton = ({ onAdd }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Box sx={{ my: 'auto' }}>
          <Button onClick={onAdd}>
            <IconMore />
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export const List = ({ data, list }) => {
  const { dispatch, state } = useContext(stateContext);
  const [component, { loading, error }] = useComponent(list, {});
  const [title, setTitle] = useState('');
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  if (loading) {
    return null;
  }

  const addEntry = async (e) => {
    setTitle('');
    const res = await component.props.add({
      title,
      completed: false,
    });
    const id = res.id;
    dispatch({
      type: Actions.SHOW_MESSAGE,
      value: `Added ${title}. Undo? (Ctrl+Z)`,
    });
    dispatch({
      type: Actions.RECORD_CHANGE,
      message: `Added ${title}. Undo?`,
      value: {
        reverse: () => {
          component.props.remove(id);
        },
      },
    });
  };
  return (
    <Card sx={{ height: '100%' }}>
      {error && <Alert severity="error">{error.message}</Alert>}
      <CardHeader
        title={
          <>
            {!edit && (
              <Typography variant="h6">{component?.props?.title}</Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                inputRef={inputRef}
                value={edit ? component?.props?.title : title}
                label={edit ? 'Title' : 'Add Entry'}
                onChange={(e) =>
                  edit
                    ? component?.props?.setTitle(e.target.value)
                    : setTitle(e.target.value)
                }
                onKeyDown={(e) => {
                  if (!edit && e.key === 'Enter') {
                    addEntry(e);
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setTitle('');
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        disabled={!title}
                      >
                        <IconClear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton disabled={!title} onClick={addEntry}>
                <IconMore />
              </IconButton>
            </Box>
          </>
        }
      ></CardHeader>
      <MUIList>
        {component?.children.map((todo, i) => (
          <TodoItem
            key={i}
            todo={todo.key}
            edit={edit}
            remove={component?.props?.remove}
          />
        ))}
      </MUIList>
      <CardActions>
        <Button onClick={() => setTitle('') || setEdit(!edit)}>
          <EditIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

const TodoItem = (props) => {
  const { dispatch, state } = useContext(stateContext);
  const { todo, edit, remove } = props;
  const [component, { loading }] = useComponent(todo, {});

  if (loading) return null;

  return (
    <ListItem>
      {edit && (
        <ListItemIcon>
          <IconButton onClick={() => remove(component.props.id)}>
            <RemoveCircleIcon />
          </IconButton>
        </ListItemIcon>
      )}
      <ListItemText primary={component.props.title} />
      <ListItemSecondaryAction>
        <Checkbox
          checked={component?.props.completed}
          onClick={() => {
            dispatch({
              type: Actions.SHOW_MESSAGE,
              value: `Marked ${component.props.title}. Undo? (Ctrl+Z)`,
            });
            dispatch({
              type: Actions.RECORD_CHANGE,
              value: {
                reverse: () => {
                  console.log('Reversing');
                  component?.props.toggle();
                },
              },
            });
            component?.props.toggle();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
