import { createBrowserRouter } from 'react-router';
import Landing from '@/app/pages/Landing';
import SignIn from '@/app/pages/SignIn';
import SignUp from '@/app/pages/SignUp';
import Dashboard from '@/app/pages/Dashboard';
import NotFound from '@/app/pages/NotFound';

import Features from '@/app/pages/Features';
import Pricing from '@/app/pages/Pricing';
import Security from '@/app/pages/Security';
import Product from '@/app/pages/Product';
import Docs from '@/app/pages/Docs';
import Tutorials from '@/app/pages/Tutorials';
import ApiReference from '@/app/pages/ApiReference';
import GettingStarted from '@/app/pages/GettingStarted';

import About from '@/app/pages/About';
import Blog from '@/app/pages/Blog';
import Careers from '@/app/pages/Careers';
import Company from '@/app/pages/Company';
import Resources from '@/app/pages/Resources';
import HelpCenter from '@/app/pages/HelpCenter';
import Contact from '@/app/pages/Contact';
import Privacy from '@/app/pages/Privacy';
import MarketingLayout from '@/app/components/MarketingLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    Component: MarketingLayout,
    children: [
      {
        path: '/product',
        Component: Product,
      },
      {
        path: '/company',
        Component: Company,
      },
      {
        path: '/resources',
        Component: Resources,
      },
      {
        path: '/features',
        Component: Features,
      },
      {
        path: '/pricing',
        Component: Pricing,
      },
      {
        path: '/security',
        Component: Security,
      },
      { path: '/about', Component: About },
      { path: '/blog', Component: Blog },
      { path: '/careers', Component: Careers },
      { path: '/docs', Component: Docs },
      { path: '/getting-started', Component: GettingStarted },
      { path: '/tutorials', Component: Tutorials },
      { path: '/api-reference', Component: ApiReference },
      { path: '/help', Component: HelpCenter },
      { path: '/contact', Component: Contact },
      { path: '/privacy', Component: Privacy },
    ],
  },
  {
    path: '/signin',
    Component: SignIn,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
