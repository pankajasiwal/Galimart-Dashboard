import type { IShopInfo } from "../../zod/profile.zod";

export default function FormInputField({
  label,
  inputType,
  placeholder,
  id,
  field,
}: {
  label: string;
  inputType: string;
  placeholder: string;
  id: keyof IShopInfo;
  field: any;
}) {
  let input;
  switch (inputType) {
    case "textarea":
      input = (
        <textarea
          id={id as string}
          className="input-field"
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      );
      break;

    default:
      input = (
        <input
          type={inputType}
          id={id as string}
          className="input-field"
          placeholder={placeholder}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      );
      break;
  }
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id as string}
        className="text-sm font-medium text-text-primary capitalize"
      >
        {label}
      </label>
      {input}
      {field.state.meta.errors.length > 0 && (
        <em className="text-error text-xs">
          {field.state.meta.errors[0].message}
        </em>
      )}
    </div>
  );
}
