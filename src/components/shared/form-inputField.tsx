export default function FormInputField({
  label,
  inputType,
  placeholder,
}: {
  label: string;
  inputType: string;
  placeholder: string;
}) {
  let input;
  switch (inputType) {
    case "textarea":
      input = (
        <textarea
          id={label}
          className="input-field"
          placeholder={placeholder}
        />
      );
      break;

    default:
      input = (
        <input
          type={inputType}
          id={label}
          className="input-field"
          placeholder={placeholder}
        />
      );
      break;
  }
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={label}
        className="text-sm font-medium text-text-primary capitalize"
      >
        {label}
      </label>
      {input}
    </div>
  );
}
