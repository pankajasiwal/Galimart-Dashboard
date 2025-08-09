import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ConfigProvider } from 'antd';
// import 'antd/dist/reset.css';

import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const getCssVariable = (variable: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        // algorithm: theme.darkAlgorithm,
        token: {
          // Primary colors
          colorPrimary: getCssVariable('--color-primary'),
          colorSuccess: getCssVariable('--color-success'),
          colorWarning: getCssVariable('--color-warning'),
          colorError: getCssVariable('--color-error'),
          colorInfo: getCssVariable('--color-info'),

          // Background colors
          colorBgBase: getCssVariable('--color-bg-primary'),
          colorBgContainer: getCssVariable('--color-bg-secondary'),
          colorBgElevated: getCssVariable('--color-bg-elevated'),
          colorBgLayout: getCssVariable('--color-bg-primary'),
          colorBgSpotlight: getCssVariable('--color-bg-tertiary'),

          // Text colors
          colorText: getCssVariable('--color-text-primary'),
          colorTextSecondary: getCssVariable('--color-text-secondary'),
          colorTextTertiary: getCssVariable('--color-text-tertiary'),
          colorTextQuaternary: getCssVariable('--color-text-muted'),

          // Border colors
          colorBorder: getCssVariable('--color-border-primary'),
          colorBorderSecondary: getCssVariable('--color-border-secondary'),

          // Shadow (dark theme appropriate)
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 1px 3px 1px rgba(0, 0, 0, 0.4)',
          boxShadowSecondary: '0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 1px rgba(0, 0, 0, 0.3)',
          boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
);
