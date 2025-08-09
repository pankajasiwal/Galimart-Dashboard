import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return <div>Hello "/profile"!</div>;
}
