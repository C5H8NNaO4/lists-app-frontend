import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButtonProps,
} from '@mui/material';
import { Component, ComponentType, ReactNode, useContext } from 'react';
import { Actions, stateContext } from '../provider/StateProvider';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { navigation } from '../routes';

export const SidebarNavigation = () => {
  const { state, dispatch } = useContext(stateContext);
  return (
    <Drawer
      open={state.menuOpen}
      onClose={() => dispatch({ type: Actions.TOGGLE_MENU })}
    >
      <List sx={{ paddingTop: 8, minWidth: 256 }}>
        <List disablePadding>
          {navigation.map((e: any) => {
            return (
              <LinkItem
                Icon={e[4]}
                to={e[0]}
                sx={{
                  ml:
                    1 +
                    (e[0] === '/'
                      ? 0
                      : (e[0].match(/\//g)?.length || 0 - 2) * 2),
                }}
              >
                {e[1]}
              </LinkItem>
            );
          })}
        </List>
      </List>
    </Drawer>
  );
};

type LinkItemProps = {
  to: string;
  children: React.ReactNode;
  sx?: any;
  Icon: ComponentType<IconButtonProps>;
};

const LinkItem = ({ to, children, sx, Icon }: LinkItemProps) => {
  const { pathname } = useLocation();
  return (
    <ListItem
      button
      component={RouterLink}
      to={to}
      sx={sx}
      selected={pathname === to}
      dense
      disablePadding
    >
      {Icon && (
        <ListItemIcon>
          {<Icon color={to === pathname ? 'secondary' : 'primary'} />}
        </ListItemIcon>
      )}
      <ListItemText primary={children} secondary={to} />
    </ListItem>
  );
};
