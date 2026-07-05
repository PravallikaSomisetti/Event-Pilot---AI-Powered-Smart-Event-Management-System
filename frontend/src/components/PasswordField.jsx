import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordField({
  label,
  placeholder,
  register,
  name,
  errors,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-3 text-gray-500"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}

export default PasswordField;