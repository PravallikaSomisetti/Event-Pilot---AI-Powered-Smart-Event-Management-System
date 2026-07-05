function InputField({
  label,
  type = "text",
  placeholder,
  register,
  name,
  errors,
  required = true,
}) {
  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}

export default InputField;