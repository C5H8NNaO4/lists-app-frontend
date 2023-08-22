import { MyLists } from '../server-components/examples/Lists';
import { authContext } from '@state-less/react-client';
import { useContext } from 'react';
import { ListsMeta, Meta } from '../components/Meta';

export const IndexPage = () => {
  const ctx = useContext(authContext);
  return (
    <div>
      <Meta Component={ListsMeta} />
      <MyLists key={ctx?.session?.id} />
    </div>
  );
};
