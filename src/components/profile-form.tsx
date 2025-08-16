import ProfileCard from './shared/profile-card';
import FormInputField from './shared/form-inputField';
import { AimOutlined, HomeOutlined, ShopOutlined } from '@ant-design/icons';
import { AddressPickerModal, type AddressPayload } from './address-picker-modal';
import { useState } from 'react';

type ProfileFormProps = {
  form: any;
};

const FORMINPUTS: Array<any> = [
  {
    title: 'shop information',
    icon: <ShopOutlined />,
    inputs: [
      [
        { label: 'shop name', id: 'shopName', inputType: 'text', placeholder: 'Pankaj General Store' },
        { label: 'owner name', id: 'ownerName', inputType: 'text', placeholder: 'Pankaj ASiwal' },
      ],
      [
        {
          label: 'shop description',
          id: 'shopDescription',
          inputType: 'textarea',
          placeholder: 'Tell customer about your shop...',
        },
      ],
      [
        { label: 'phone number', id: 'phoneNumber', inputType: 'text', placeholder: 'xxxxxxxxxx' },
        { label: 'email', id: 'email', inputType: 'email', placeholder: 'pankaj@example.com' },
      ],
    ],
  },
  {
    title: 'address information',
    icon: <HomeOutlined />,
    inputs: [
      [{ label: 'street address', id: 'streetAddress', inputType: 'textarea', placeholder: 'Your shop address..' }],
      [
        { label: 'city', id: 'city', inputType: 'text', placeholder: 'Your City' },
        { label: 'state', id: 'state', inputType: 'text', placeholder: 'Your state' },
        { label: 'pincode', id: 'pincode', inputType: 'text', placeholder: 'Pincode' },
      ],
    ],
  },
];
export default function ProfileForm({ form }: ProfileFormProps) {
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const handleConfirmAddress = (payload: AddressPayload) => {
    const { fullAddress, parts } = payload;

    // Try both common APIs: TanStack React Form and other libs
    const setVal = (name: string, value: string) => {
      if ((form as any)?.setFieldValue) (form as any).setFieldValue(name, value);
      else if ((form as any)?.setValue) (form as any).setValue(name, value);
      else if ((form as any)?.setFieldsValue) (form as any).setFieldsValue({ [name]: value });
    };

    setVal('streetAddress', fullAddress);
    if (parts.city) setVal('city', parts.city);
    if (parts.state) setVal('state', parts.state);
    if (parts.pincode) setVal('pincode', parts.pincode);
  };
  return (
    <>
      {FORMINPUTS.map((item) => (
        <ProfileCard icon={item.icon} title={item.title} key={item.title}>
          {item.title === 'address information' && (
            <button
              type='button'
              onClick={() => setAddressModalOpen(true)}
              className='flex items-center w-fit gap-2 cursor-pointer text-text-secondary p-2 rounded-md hover:bg-bg-elevated'
            >
              <AimOutlined style={{ color: 'inherit' }} />
              <span className='text-text-secondary'>Locate your location</span>
            </button>
          )}
          <div className='grid grid-cols-1 gap-3'>
            {item.inputs.map((row: any, rowIndex: number) => (
              <div
                className={`grid grid-cols-1 ${item.title === 'address information' && rowIndex === 1 ? `md:grid-cols-2 lg:grid-cols-${row.length}` : `lg:grid-cols-${row.length}`}  gap-3 lg:gap-4`}
                key={rowIndex}
              >
                {row.map((ipt: any) => (
                  <form.Field
                    key={ipt.id}
                    name={ipt.id}
                    children={(field: any) => (
                      <FormInputField
                        id={ipt.id}
                        label={ipt.label}
                        inputType={ipt.inputType}
                        placeholder={ipt.placeholder}
                        field={field}
                      />
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </ProfileCard>
      ))}
      <AddressPickerModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onConfirm={handleConfirmAddress}
        countryCodes='in'
      />
    </>
  );
}
