import { MyLists } from '../server-components/examples/Lists';
import { authContext } from '@state-less/react-client';
import { useContext } from 'react';

export const IndexPage = () => {
  const ctx = useContext(authContext);
  return (
    <div>
      <MyLists key={ctx?.session?.id} />
    </div>
  );
};
