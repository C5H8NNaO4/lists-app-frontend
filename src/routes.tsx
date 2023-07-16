import { Route } from 'react-router';
import { IndexPage } from './pages';

export const navigation = [
  ['/', 'Home'],
]

export const routes = [
  <Route path="/" Component={IndexPage} />,
];
