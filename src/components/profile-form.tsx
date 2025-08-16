import ProfileCard from './shared/profile-card';
import FormInputField from './shared/form-inputField';

type ProfileFormProps = {
  form: any;
};

export default function ProfileForm({ form }: ProfileFormProps) {
  const FORMINPUTS: Array<any> = [
    {
      title: 'shop information',
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
  return (
    <>
      {FORMINPUTS.map((item) => (
        <ProfileCard title={item.title} key={item.title}>
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
    </>
  );
}
