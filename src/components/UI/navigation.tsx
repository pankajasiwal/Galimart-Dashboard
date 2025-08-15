import { HomeOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { INavigationMenu } from '../../types/nav.type';
import { Link, useLocation } from '@tanstack/react-router';
import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';

const navigationMenu: INavigationMenu[] = [
  { label: 'home', icon: <HomeOutlined />, path: '/' },
  { label: 'product', icon: <PlusCircleOutlined />, path: '/product' },
  { label: 'profile', icon: <UserOutlined />, path: '/profile' },
];

export default function Navigation() {
  return (
    <>
      <div className='md:hidden fixed bottom-0 left-0 right-0 w-full bg-bg-secondary z-50'>
        <MobileNavigation />
      </div>

      <DesktopNavigation />
    </>
  );
}

export function MobileNavigation() {
  return (
    <nav className='container p-4'>
      <ul className='flex justify-between'>
        {navigationMenu.map((item) => (
          <li key={item.label}>
            <Link to={item.path} className='flex flex-col items-center gap-1 [&.active]:font-bold'>
              {item.icon}
              <span className='capitalize'>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DesktopNavigation() {
  const { pathname } = useLocation();
  return (
    <div className='hidden md:block md:border-r-2 md:border-border-primary'>
      <Layout hasSider style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <Sider
          width={'14rem'}
          className='h-screen text-text-primary'
          style={{ maxHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <div className='flex flex-col gap-8 p-2 lg:p-4'>
            <div className=''>
              <h1 className='text-text-primary text-xl font-medium'>GaliMart Dashboard</h1>
            </div>

            <ul className='space-y-4'>
              {navigationMenu.map((item) => (
                <li key={item.label} className={pathname === item.path ? 'bg-bg-tertiary rounded-md p-2' : 'p-2'}>
                  <Link to={item.path} className='flex items-center gap-2 lg:text-lg' style={{ color: 'inherit' }}>
                    {item.icon} <span className='capitalize'>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Sider>
      </Layout>
    </div>
  );
}
