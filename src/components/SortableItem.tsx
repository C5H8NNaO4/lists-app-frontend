import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMediaQuery, useTheme, Box } from '@mui/material';

export function SortableItem(props) {
  const { id, DragHandle, ...rest } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: props.fullHeight ? '100%' : undefined,
    overflow: 'hidden',
    padding: '4px',
    cursor: 'pointer',
  };

  delete listeners?.onKeyDown;
  const theme = useTheme();
  const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));

  if (!props.enabled) {
    return (
      <div key="draghandle" style={style}>
        {props.children}
      </div>
    );
  }

  if (props.DragHandle) {
    return (
      <Box
        key="draghandle"
        ref={setNodeRef}
        style={style}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Box sx={{ touchAction: 'none' }}>
          <props.DragHandle {...attributes} {...listeners} />
        </Box>
        <Box sx={{ display: 'block', width: '100%' }}>{props.children}</Box>
      </Box>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
}
