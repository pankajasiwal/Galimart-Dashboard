import { createLazyFileRoute } from '@tanstack/react-router';
import ProfileCard from '../components/shared/profile-card';
import FormInputField from '../components/shared/form-inputField';

export const Route = createLazyFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className='w-full p-3 mb-[109px] md:p-6 md:mb-0 lg:max-w-6xl lg:mx-auto'>
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] xl:grid-cols-[70%_30%] gap-4">
        <div className='grid grid-cols-1 gap-4 '>
          <ProfileCard title='shop information'>
            <form className='grid grid-cols-1 gap-3'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4'>
                <FormInputField label='shop name' inputType='text' placeholder='Sharma General Store'/>
                <FormInputField label='owner name' inputType='text' placeholder='Pankaj Asiwal'/>
              </div>
              <div className="grid grid-cols-1">
                <FormInputField label='shop description' inputType='textarea' placeholder='Tell customer about your shop...'/>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                <FormInputField label='phone number' inputType='text' placeholder='xxxxxxxxxx'/>
                <FormInputField label='email' inputType='email' placeholder='pankaj@example.com'/>
              </div>
            </form>
          </ProfileCard>
          <ProfileCard title='address information'>
            <form className='grid grid-cols-1 gap-3'>
              <div className="grid grid-cols-1">
                <FormInputField label='street address' inputType='textarea' placeholder='Your shop address..'/>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4'>
                <FormInputField label='city' inputType='text' placeholder='City'/>
                <FormInputField label='state' inputType='text' placeholder='State'/>
                <FormInputField label='pincode' inputType='text' placeholder='Pincode'/>
              </div>
            </form>
          </ProfileCard>
        </div>
        <div className='self-start'>
          <ProfileCard title='Quick info'>
            quick ingo
          </ProfileCard>
        </div>
      </div>
    </div>
  );
}
