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
        id="data-loss"
        title={`Please backup / sync your data frequently as there's currently no database
      connected to the server. Data-loss may occur in unexpected circumstances.`}
      />
      <MyLists key={ctx?.session?.id} />
    </div>
  );
};
