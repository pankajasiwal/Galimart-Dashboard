import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Navigation from '../components/UI/navigation';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className='min-h-screen bg-bg-primary text-text-primary font-poppins'>
        <div className='flex'>
          <Navigation />
          <div className='max-h-screen overflow-y-auto w-full'>
            <Outlet />
          </div>
        </div>
      </div>
      {/* <TanStackRouterDevtools /> */}
    </React.Fragment>
  );
}
