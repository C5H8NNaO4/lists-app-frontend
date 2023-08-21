import { Route } from 'react-router';
import { IndexPage } from './pages';
import { ChangeLog } from './pages/changelog';
import { AnalyticsPage } from './server-components/examples/Analytics';

export const navigation = [
  ['/', 'Home'],
  ['/analytics', 'Analytics'],
  ['/changes', 'Changelog'],
];

export const routes = [
  <Route path="/" Component={IndexPage} />,
  <Route path="/changes" Component={ChangeLog} />,
  <Route path="/analytics" Component={AnalyticsPage} />,
];
