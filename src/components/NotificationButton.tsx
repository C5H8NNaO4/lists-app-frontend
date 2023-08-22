import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { IconButton } from '@mui/material';
import { useComponent, useLocalStorage } from '@state-less/react-client';
import { useEffect } from 'react';

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  return permission;
};

export const NotificationButton = () => {
  const [pushManager] = useComponent('web-push');
  const [permission, setPermission] = useLocalStorage<{
    notification: string | null;
    subscription: boolean | null;
  }>('permission', {
    notification: null,
    subscription: null,
  });

  useEffect(() => {
    (async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      setPermission({
        notification: Notification.permission,
        subscription: !!sub,
      });
    })();
  }, []);

  const toggleNotifications = async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();

    if (
      Notification.permission !== 'granted' ||
      (Notification.permission === 'granted' && !sub)
    ) {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        if (!sub) {
          const sub = await reg?.pushManager.subscribe({
            applicationServerKey: pushManager.props.vapid,
            userVisibleOnly: true,
          });
          await pushManager.props.subscribe(JSON.stringify(sub));
          setPermission({
            ...permission,
            subscription: true,
          });
        }
        await pushManager.props.sendNotification({
          title: 'Welcome to Lists',
          body: 'You have been granted permission to receive notifications',
        });
      } else {
        setPermission({
          notification: perm,
          subscription: !!sub,
        });
      }
    } else {
      await pushManager.props.sendNotification({
        title: 'Goodbye',
        body: "You won't receive any more notifications.",
      });
      setTimeout(async () => {
        const res = await sub?.unsubscribe();
        setPermission({
          ...permission,
          subscription: false,
        });
        await pushManager.props.unsubscribe(JSON.stringify(sub));
      }, 1000);
    }
  };

  return (
    <IconButton
      disabled={permission.notification === 'denied'}
      color={
        permission.notification === 'granted'
          ? permission.subscription
            ? 'success'
            : 'warning'
          : undefined
      }
      sx={{ ml: 'auto' }}
      onClick={(e) => (toggleNotifications(), void 0)}
    >
      <NotificationsNoneIcon />
    </IconButton>
  );
};
