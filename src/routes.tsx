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
import ForumIcon from '@mui/icons-material/Forum';

import { CommunityPage } from './pages/community';
import { PostsPage } from './pages/community/post';

export const navigation = [
  ['/', 'Home', '', 'Lists', HomeIcon],
  ['/welcome', 'Welcome', '', 'Welcome to Lists', WbSunnyIcon],
  ['/community', 'Community', '', 'Be part of Lists', ForumIcon],
  ['/about', 'About', '', 'About Lists', InfoIcon],
  ['/analytics', 'Analytics', 'analytics', 'Analytics', AutoGraphIcon],
  ['/changes', 'Changelog', 'changelog', 'Changelog', ChangeHistoryIcon],
  ['/settings', 'Settings', 'settings', 'Settings', SettingsIcon],
] as any;

export const routes = [
  <Route path="/" Component={IndexPage} />,
  <Route path="/settings" Component={SettingsPage} />,
  <Route path="/welcome" Component={WelcomePage} />,
  <Route path="/community" Component={CommunityPage} />,
  <Route path="/community/:post" Component={PostsPage} />,
  <Route path="/about" Component={ListsAboutPage} />,
  <Route path="/changes" Component={ChangeLog} />,
  <Route path="/analytics" Component={AnalyticsPage} />,
  <Route path="*" Component={ListsAboutPage} />,
];
