import { Route } from 'react-router';
import { IndexPage } from './pages';
import { ChangeLog } from './pages/changelog';
import { AnalyticsPage } from './server-components/examples/Analytics';
import { ListsAboutPage } from './pages/about';
import { WelcomePage } from './pages/welcome';
import { SettingsPage } from './pages/settings';

import HomeIcon from '@mui/icons-material/Home';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import InfoIcon from '@mui/icons-material/Info';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import SettingsIcon from '@mui/icons-material/Settings';

export const navigation = [
  ['/', 'Home', '', 'Lists', HomeIcon],
  ['/welcome', 'Welcome', '', 'Welcome to Lists', WbSunnyIcon],
  ['/about', 'About', '', 'About Lists', InfoIcon],
  ['/analytics', 'Analytics', 'analytics', 'Analytics', AutoGraphIcon],
  ['/changes', 'Changelog', 'changelog', 'Changelog', ChangeHistoryIcon],
  ['/settings', 'Settings', 'settings', 'Settings', SettingsIcon],
] as any;

export const routes = [
  <Route path="/" Component={IndexPage} />,
  <Route path="/settings" Component={SettingsPage} />,
  <Route path="/welcome" Component={WelcomePage} />,
  <Route path="/about" Component={ListsAboutPage} />,
  <Route path="/changes" Component={ChangeLog} />,
  <Route path="/analytics" Component={AnalyticsPage} />,
  <Route path="*" Component={ListsAboutPage} />,
];
