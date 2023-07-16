import { Grid } from '@mui/material';
import { List, MyLists } from '../server-components/Todos';
import { authContext } from '@state-less/react-client';
import { useContext } from 'react';
export const IndexPage = () => {
  const ctx = useContext(authContext);
  console.log('CTX', ctx);
  return (
    <div>
      <MyLists key={ctx?.session?.id} />
    </div>
  );
};
