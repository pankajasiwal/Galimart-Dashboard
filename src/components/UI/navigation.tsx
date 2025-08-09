import { HomeOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { INavigationMenu } from '../../types/nav.type';
import { Link } from '@tanstack/react-router';
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
  return (
    <div className='hidden md:block'>
      <Layout hasSider style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <Sider width={'8rem'} className='h-screen text-text-primary' style={{ maxWidth: '16rem', maxHeight: '100vh' }}>
          <div className='flex flex-col gap-3'>
            <div className='p-2 lg:p-4 border-b'>
              <h1 className='text-center text-text-primary'>GaliMart</h1>
            </div>

            <ul className='space-y-4 self-center'>
              {navigationMenu.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className='flex items-center gap-2 lg:text-lg [&.active]:font-bold'
                    style={{ color: 'inherit' }}
                  >
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
