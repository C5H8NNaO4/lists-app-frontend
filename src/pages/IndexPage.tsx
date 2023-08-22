import { MyLists } from '../server-components/examples/Lists';
import { authContext } from '@state-less/react-client';
import { useContext } from 'react';
import { ListsMeta, Meta } from '../components/Meta';
import { Warning } from '../components/Warning';

export const IndexPage = () => {
  const ctx = useContext(authContext);
  return (
    <div>
      <Meta Component={ListsMeta} />
      <Warning id="data-loss" />
      <MyLists key={ctx?.session?.id} />
    </div>
  );
};
