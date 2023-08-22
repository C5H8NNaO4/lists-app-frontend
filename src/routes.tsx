import { Route } from 'react-router';
import { IndexPage } from './pages';
import { ChangeLog } from './pages/changelog';
import { AnalyticsPage } from './server-components/examples/Analytics';
import { ListsAboutPage } from './pages/about';

export const navigation = [
  ['/', 'Home', '', 'Lists'],
  ['/about', 'About', '', 'About Lists'],
  ['/analytics', 'Analytics', 'analytics', 'Analytics'],
  ['/changes', 'Changelog', 'changelog', 'Changelog'],
];

export const routes = [
  <Route path="/" Component={IndexPage} />,
  <Route path="/about" Component={ListsAboutPage} />,
  <Route path="/changes" Component={ChangeLog} />,
  <Route path="/analytics" Component={AnalyticsPage} />,
  <Route path="*" Component={ListsAboutPage} />,
];
