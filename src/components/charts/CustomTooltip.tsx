import { ListItem, ListItemText, Paper } from '@mui/material';

export const CustomTooltip = ({
  active,
  payload,
}: {
  active?: null | string | string[];
  payload?: any;
}) => {
  return (
    <Paper
      className="noFocus"
      elevation={1}
      sx={{
        background: '#FFFFFFAA',
        backdropFilter: 'blur(2px);',
        '&:hover': {
          background: '#000',
        },
        display: 'flex',
        maxWidth: '750px',
        flexWrap: 'wrap',
      }}
    >
      {Object.keys(payload?.[0]?.payload || {})
        .filter((key) => !['date'].includes(key))
        .filter(
          (key) =>
            active?.length === 0 ||
            (active ? [active].flat().includes(key) : true)
        )
        .map((key, i, arr) => {
          return (
            <ListItem
              key={key}
              sx={{
                maxWidth:
                  arr.length > 20 ? '20%' : arr.length > 10 ? '33%' : '50%',
              }}
            >
              <ListItemText
                sx={{ my: 0, p: 0 }}
                primary={key}
                secondary={payload[0]?.payload[key]}
              />
            </ListItem>
          );
        })}
    </Paper>
  );
};
