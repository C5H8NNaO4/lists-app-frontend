import { Avatar, Button, useMediaQuery, useTheme } from '@mui/material';
import { authContext } from '@state-less/react-client';
import { useContext, useState } from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import GoogleIcon from '@mui/icons-material/Google';
import { GOOGLE_ID } from '../lib/config';
import { stateContext } from '../provider/StateProvider';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const logError = (e) => {
  console.log('Google Login error', e);
};

const isGoogleLoginResponse = (val: any): val is GoogleLoginResponse => {
  return val?.tokenId !== undefined && val.accessToken !== undefined;
};

export const LoggedInGoogleButton = () => {
  const { session, logout } = useContext(authContext);
  const { state } = useContext(stateContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();
  const lessThanSmall = useMediaQuery(theme.breakpoints.down('sm'));

  if (session.strategy !== 'google') {
    return null;
  }

  const decoded = session.strategies.google.decoded;

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color={state.animatedBackground ? 'info' : 'info'}
      >
        <Avatar
          src={decoded.picture}
          sx={{ width: 24, height: 24, mr: 1 }}
        ></Avatar>
        {lessThanSmall ? '' : decoded.given_name}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export const GoogleLoginButton = () => {
  const { session, authenticate } = useContext(authContext);
  const { state } = useContext(stateContext);

  return session?.strategy === 'google' ? (
    <LoggedInGoogleButton />
  ) : (
    <GoogleLogin
      clientId={GOOGLE_ID}
      buttonText="Login"
      onSuccess={(response) => {
        if (!isGoogleLoginResponse(response)) {
          return;
        }
        const { tokenId, accessToken } = response;
        authenticate({
          strategy: 'google',
          data: { accessToken, idToken: tokenId },
        });
      }}
      render={(props) => {
        return (
          <Button color={state.animatedBackground ? 'info' : 'info'} {...props}>
            <GoogleIcon sx={{ mr: 1 }} />
            Login
          </Button>
        );
      }}
      onFailure={logError}
      cookiePolicy={'single_host_origin'}
    />
  );
};
