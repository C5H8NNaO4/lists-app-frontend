import {
  Container,
  Paper,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActionArea,
  CardActions,
  Button,
  Chip,
  Box,
  InputAdornment,
} from '@mui/material';
import { useRef, useState } from 'react';
import { FlexBox } from '../../components/FlexBox';
import { useComponent } from '@state-less/react-client';
import { useNavigate } from 'react-router';
import { FORUM_KEY } from '../../lib/config';

export const Tags = ({ onChange }) => {
  const [tags, setTags] = useState<Array<string>>([]);
  const [tag, setTag] = useState('');
  const ref = useRef();
  const onKeyDown = (e) => {
    if (e.key === 'Backspace' && tag === '') {
      setTags(tags.slice(0, -1));
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (tags.length >= 5) return;
      if (tags.includes(tag)) return;
      setTag('');
      setTags([...tags, tag.toLowerCase()]);
      onChange([...tags, tag.toLowerCase()]);
    }
  };
  return (
    <FlexBox>
      <TextField
        color={tags.includes(tag) ? 'error' : 'secondary'}
        InputProps={{
          inputProps: {
            pattern: '[a-z]',
          },
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    label={tag}
                    onDelete={() =>
                      setTags(tags.filter((filtered) => filtered !== tag))
                    }
                  />
                ))}
              </Box>
            </InputAdornment>
          ),
        }}
        value={tag}
        disabled={tags.length >= 5}
        onKeyDown={onKeyDown}
        onChange={(e) => setTag(e.target.value)}
      ></TextField>
    </FlexBox>
  );
};
export const NewPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [component, { error, loading }] = useComponent(FORUM_KEY);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" disableGutters>
      <Card>
        <CardHeader title={'Create a new Post'}></CardHeader>
        <CardContent sx={{ pb: 0 }}>
          <Typography variant="h5">Title</Typography>
          <Typography>
            Be specific and imagine you’re talking to another person.
          </Typography>
          <TextField
            fullWidth
            color="secondary"
            id="outlined-multiline-flexible"
            label="Title"
            multiline
            maxRows={4}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CardContent>
        <CardContent sx={{ pb: 0 }}>
          <Typography variant="h5">Body</Typography>
          <Typography>
            Include all the information someone would need to understand the
            topic.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={7}
            color="secondary"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </CardContent>
        <CardContent>
          <Typography variant="h6">Tags</Typography>
          <Tags onChange={setTags} />
        </CardContent>
        <CardActionArea>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                const post = await component?.props?.createPost({
                  title,
                  body,
                  tags,
                });

                setTimeout(() => {
                  navigate(`/post-${post.id}`);
                }, 250);
              }}
            >
              Post
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    </Container>
  );
};
