import { AddCircleOutline } from '@mui/icons-material';
import {
  Box,
  Chip,
  ClickAwayListener,
  IconButton,
  Popover,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { useComponent } from '@state-less/react-client';
import { useRef, useState } from 'react';

export const ReactionIcons = {
  love: () => <Box sx={{ fontSize: 18, ml: 0.5 }}>❤️</Box>,
  clap: () => <Box sx={{ fontSize: 18, ml: 0.5 }}>👏</Box>,
  smile: () => <Box sx={{ fontSize: 18, ml: 0.5 }}>😊</Box>,
  laugh: () => <Box sx={{ fontSize: 18, ml: 0.5 }}>😂</Box>,
  nerd: () => <Box sx={{ fontSize: 18, ml: 0.5 }}>🤓</Box>,
  'smile-hearts': () => <Box sx={{ fontSize: 18, ml: 0.5 }}>🥰</Box>,
  'thumbs-up': () => <Box sx={{ fontSize: 18, ml: 0.5 }}>👍</Box>,
  'thumbs-down': () => <Box sx={{ fontSize: 18, ml: 0.5 }}>👎</Box>,
};

const groups = {
  smileys: ['laugh', 'smile', 'nerd', 'smile-hearts'],
  hands: ['thumbs-up', 'thumbs-down', 'clap'],
  emotions: ['heart', 'love', 'laugh', 'smile'],
};
const reactionTags = {
  love: ['love', 'heart'],
  'thumbs-up': ['thumb', 'up', 'like', 'hand'],
  'thumbs-down': ['thumb', 'down', 'like', 'hand'],
  clap: ['clap', 'hand'],
  laugh: ['laugh', 'smile'],
  smile: ['smile'],
  nerd: ['nerd', 'smile'],
  'smile-hearts': ['smile', 'heart'],
};
const availableReactions = [
  'love',
  'thumbs-up',
  'thumbs-down',
  'clap',
  'laugh',
  'smile',
  'nerd',
  'smile-hearts',
];

export const Reactions = ({ data }) => {
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
          const Icon = ReactionIcons[reaction];
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
          color={anchor ? 'success' : 'default'}
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

const ReactionPopper = ({ anchor, id, onClose, react }) => {
  const [search, setSearch] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
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
          <TextField
            size="small"
            value={search}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Tabs
            value={group}
            indicatorColor="primary"
            onClick={(e) => setGroup(null)}
            onChange={(e, v) => {
              e.stopPropagation();
              setGroup(v);
            }}
          >
            <Tab sx={{ minWidth: '40px' }} value={'smileys'} icon={'🙂'}></Tab>
            <Tab sx={{ minWidth: '40px' }} value={'hands'} icon={'🤚'}></Tab>
            <Tab sx={{ minWidth: '40px' }} value={'emotions'} icon={'❤️'}></Tab>
          </Tabs>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 40px)' }}>
            {availableReactions
              .filter((reaction) => {
                return reactionTags[reaction]?.some((tag) => {
                  if (!search) {
                    if (group) {
                      return groups[group]?.includes(reaction);
                    }
                    return true;
                  }
                  if (
                    search
                      .toLowerCase()
                      .split(' ')
                      .some((word) => word && tag.includes(word))
                  ) {
                    return true;
                  }
                  return false;
                });
              })
              .map((reaction) => {
                const Icon = ReactionIcons[reaction];
                return (
                  <IconButton
                    onClick={() => react(reaction)}
                    sx={{ pl: '4px' }}
                  >
                    {<Icon />}
                  </IconButton>
                );
              })}
          </Box>
        </Box>
      </ClickAwayListener>
    </Popover>
  );
};
