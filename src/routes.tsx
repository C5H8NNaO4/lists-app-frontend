import { Route } from 'react-router';
import { IndexPage } from './pages';
import { ChangeLog } from './pages/changelog';
import { AnalyticsPage } from './server-components/examples/Analytics';
import { ListsAboutPage } from './pages/about';
import { WelcomePage } from './pages/welcome';
import { SettingsPage } from './pages/settings';

export const navigation = [
  ['/', 'Home', '', 'Lists'],
  ['/welcome', 'Welcome', '', 'Welcome to Lists'],
  ['/about', 'About', '', 'About Lists'],
  ['/analytics', 'Analytics', 'analytics', 'Analytics'],
  ['/changes', 'Changelog', 'changelog', 'Changelog'],
  ['/settings', 'Settings', 'settings', 'Settings'],
];

export const routes = [
  <Route path="/" Component={IndexPage} />,
  <Route path="/settings" Component={SettingsPage} />,
  <Route path="/welcome" Component={WelcomePage} />,
  <Route path="/about" Component={ListsAboutPage} />,
  <Route path="/changes" Component={ChangeLog} />,
  <Route path="/analytics" Component={AnalyticsPage} />,
  <Route path="*" Component={ListsAboutPage} />,
];
