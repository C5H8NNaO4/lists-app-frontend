import { MyLists } from '../server-components/examples/Lists';
import { authContext } from '@state-less/react-client';
import { useContext } from 'react';
import { ListsMeta, Meta } from '../components/Meta';
import { Warning } from '../components/Warning';
import { Button, IconButton, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export const IndexPage = () => {
  const ctx = useContext(authContext);
  const navigate = useNavigate();
  return (
    <div>
      <Meta Component={ListsMeta} />
      <Warning
        id="newsletter"
        severity="success"
        title="Signup to our newsletter to receive updates."
        action={
          <>
            <Button
              onClick={() => {
                window.open(
                  'https://mailchi.mp/400c3a137c50/e-mail-newsletter',
                  '_blank'
                );
              }}
            >
              Signup
            </Button>
          </>
        }
      />
      <Warning
        id="database"
        severity="success"
        title={`We now have a postgres database connected to the backend. We still need to implement a backup system, but for now, your data is safe.`}
      />
      <MyLists />
    </div>
  );
};
