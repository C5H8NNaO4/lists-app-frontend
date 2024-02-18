import { useContext, useState } from 'react';
import { Actions, stateContext } from '../provider/StateProvider';
import {
  Box,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popover,
} from '@mui/material';
import { SunnyBlueClouds, VantaBackground } from './Background';
import Wallpaper from '@mui/icons-material/Wallpaper';

export const BackgroundButton = () => {
  const { state } = useContext(stateContext);
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton
        color={
          state.animatedBackground == 1
            ? 'info'
            : state.animatedBackground == 2
            ? 'warning'
            : state.animatedBackground === 3
            ? 'success'
            : 'default'
        }
        onClick={(e) => {
          if (anchor) {
            setAnchor(null);
          } else {
            setAnchor(e.target as any);
          }
        }}
      >
        <Wallpaper />
      </IconButton>
      <BackgroundMenu anchor={anchor} setAnchor={setAnchor} />
    </>
  );
};

export const BackgroundMenu = ({ anchor, setAnchor }) => {
  const { dispatch } = useContext(stateContext);

  return (
    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      transformOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}
    >
      <ClickAwayListener onClickAway={() => setAnchor(null)}>
        <Box sx={{ mb: 1, width: '400px', height: '300px' }}>
          <Grid container sx={{ p: 1 }} spacing={1}>
            {[0, 1, 2, 3, 4, 5, 7, 8].map((e) => {
              return (
                <Grid item xs={6}>
                  <Box
                    onClick={() => {
                      dispatch({ type: Actions.CHOOSE_BG, value: e });
                      localStorage.setItem(
                        'animatedBackgroundUser',
                        e.toString()
                      );
                      setAnchor(null);
                    }}
                    className={'bg' + e}
                    sx={{
                      width: '100%',
                      height: '100px',
                      border: '1px solid black',
                      borderRadius: '4px',
                    }}
                  >
                    {e === 2 && (
                      <VantaBackground
                        light={SunnyBlueClouds}
                        dark={SunnyBlueClouds}
                        enabled={true}
                        bg={2}
                        el={'#inlineanim'}
                      ></VantaBackground>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </ClickAwayListener>
    </Popover>
  );
};
