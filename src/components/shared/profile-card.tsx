export default function ProfileCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='p-4 border-border-secondary border-1 rounded-md'>
      <div className='flex flex-col gap-4'>
        <div className='pb-2 flex items-center gap-2'>
          {icon}
          <h2 className='font-medium capitalize text-text-primary'>{title}</h2>
        </div>

        {children}
      </div>
    </div>
  );
}
