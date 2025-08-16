import { createLazyFileRoute } from '@tanstack/react-router';
import ProfileCard from '../components/shared/profile-card';
import { useForm } from '@tanstack/react-form';
import { shopInfoSchema, type IShopInfo } from '../schema/profile.schema';
import { Button } from 'antd';
import { useState } from 'react';
import ProfileForm from '../components/profile-form';

export const Route = createLazyFileRoute('/profile')({
  component: ProfilePage,
});

const defaultValue: IShopInfo = {
  shopName: '',
  ownerName: '',
  shopDescription: '',
  phoneNumber: '',
  email: '',
  streetAddress: '',
  city: '',
  state: '',
  pincode: '',
};

const quickInfo = [
  { label: 'shop name', key: 'shopName' },
  { label: 'owner name', key: 'ownerName' },
  { label: 'phone number', key: 'phoneNumber' },
];

function ProfilePage() {
  const [quickInfoValue, setQuickInfoValue] = useState<{ shopName: string; ownerName: string; phoneNumber: string }>({
    shopName: '',
    ownerName: '',
    phoneNumber: '',
  });
  const form = useForm({
    defaultValues: defaultValue,
    validators: { onChange: shopInfoSchema },
    onSubmit: (formData) => {
      console.log(formData.value);
      setQuickInfoValue({
        shopName: formData.value.shopName,
        ownerName: formData.value.ownerName,
        phoneNumber: formData.value.phoneNumber,
      });
    },
  });
  return (
    <div className='w-full p-3 mb-[109px] md:p-6 md:mb-0 lg:max-w-6xl lg:mx-auto'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-text-primary'>Profile Information</h1>
          <Button type='primary' htmlType='submit'>
            Save
          </Button>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-[60%_40%] xl:grid-cols-[70%_30%] gap-4'>
          <div className='grid grid-cols-1 gap-4 '>
            <ProfileForm form={form} />
          </div>
          <div className='self-start'>
            <ProfileCard title='Quick info'>
              <div className='flex flex-col gap-4'>
                {quickInfo.map((info: { label: string; key: string }) => (
                  <div className='flex flex-col gap-3' key={info.key}>
                    <p className='capitalize text-primary'>{info.label}</p>
                    <p className='border-b border-b-border-secondary p-3 capitalize text-text-secondary'>
                      {quickInfoValue[info.key as keyof typeof quickInfoValue] || '--'}
                    </p>
                  </div>
                ))}
              </div>
            </ProfileCard>
          </div>
        </div>
      </form>
    </div>
  );
}
