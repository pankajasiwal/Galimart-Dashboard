import { createLazyFileRoute } from "@tanstack/react-router";
import ProfileCard from "../components/shared/profile-card";
import FormInputField from "../components/shared/form-inputField";
import { useForm } from "@tanstack/react-form";
import { shopInfoSchema, type IShopInfo } from "../zod/profile.zod";
import { Button } from "antd";
import { useState } from "react";

export const Route = createLazyFileRoute("/profile")({
  component: ProfilePage,
});

const defaultValue: IShopInfo = {
  shopName: "",
  ownerName: "",
  shopDescription: "",
  phoneNumber: "",
  email: "",
  streetAddress: "",
  city: "",
  state: "",
  pincode: "",
};

const quickInfo = [
  {label: 'shop name', key: 'shopName'},
  {label: 'owner name', key: 'ownerName'},
  {label: 'phone number', key: 'phoneNumber'},
]

function ProfilePage() {
  const [quickInfoValue, setQuickInfoValue] = useState<{shopName: string, ownerName: string, phoneNumber: string}>({
    shopName: '',
    ownerName: '',
    phoneNumber: ''
  })
  const form = useForm({
    defaultValues: defaultValue,
    validators: { onChange: shopInfoSchema },
    onSubmit: (formData) => {
      console.log(formData.value);
      setQuickInfoValue({shopName: formData.value.shopName, ownerName: formData.value.ownerName, phoneNumber: formData.value.phoneNumber});
    },
  });
  return (
    <div className="w-full p-3 mb-[109px] md:p-6 md:mb-0 lg:max-w-6xl lg:mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-text-primary">Profile Information</h1>

          <Button type="primary" htmlType="submit">Save</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] xl:grid-cols-[70%_30%] gap-4">
          <div className="grid grid-cols-1 gap-4 ">
            <ProfileCard title="shop information">
              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <form.Field
                    name="shopName"
                    children={(field) => (
                      <FormInputField
                        id="shopName"
                        label="shop name"
                        inputType="text"
                        placeholder="Sharma General Store"
                        field={field}
                      />
                    )}
                  />
                  <form.Field
                    name="ownerName"
                    children={(field) => (
                      <FormInputField
                        id="ownerName"
                        label="owner name"
                        inputType="text"
                        placeholder="Pankaj Asiwal"
                        field={field}
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-1">
                  <form.Field
                    name="shopDescription"
                    children={(field) => (
                      <FormInputField
                        id="shopDescription"
                        label="shop description"
                        inputType="textarea"
                        placeholder="Tell customer about your shop..."
                        field={field}
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <form.Field
                    name="phoneNumber"
                    children={(field) => (
                      <FormInputField
                        id="phoneNumber"
                        label="phone number"
                        inputType="text"
                        placeholder="xxxxxxxxxx"
                        field={field}
                      />
                    )}
                  />
                  <form.Field
                    name="email"
                    children={(field) => (
                      <FormInputField
                        id="email"
                        label="email"
                        inputType="email"
                        placeholder="pankaj@example.com"
                        field={field}
                      />
                    )}
                  />
                </div>
              </div>
            </ProfileCard>
            <ProfileCard title="address information">
              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-1">
                  <form.Field
                    name="streetAddress"
                    children={(field) => (
                      <FormInputField
                        id="streetAddress"
                        label="street address"
                        inputType="textarea"
                        placeholder="Your shop address.."
                        field={field}
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                  <form.Field
                    name="city"
                    children={(field) => (
                      <FormInputField
                        id="city"
                        label="city"
                        inputType="text"
                        placeholder="City"
                        field={field}
                      />
                    )}
                  />
                  <form.Field
                    name="state"
                    children={(field) => (
                      <FormInputField
                        id="state"
                        label="state"
                        inputType="text"
                        placeholder="State"
                        field={field}
                      />
                    )}
                  />
                  <form.Field
                    name="pincode"
                    children={(field) => (
                      <FormInputField
                        id="pincode"
                        label="pincode"
                        inputType="text"
                        placeholder="Pincode"
                        field={field}
                      />
                    )}
                  />
                </div>
              </div>
            </ProfileCard>
          </div>
          <div className="self-start">
            <ProfileCard title="Quick info">
              <div className="flex flex-col gap-4">
                {quickInfo.map((info: {label: string, key: string}) => (
                  <div className="flex flex-col gap-3">
                    <p className="capitalize text-primary">{info.label}</p>
                    <p className="border-b border-b-border-secondary p-3 capitalize text-text-secondary">{quickInfoValue[info.key as keyof typeof quickInfoValue] || '--'}</p>
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
