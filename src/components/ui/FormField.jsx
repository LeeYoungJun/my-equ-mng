export default function FormField({ label, htmlFor, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-sm font-[inherit] outline-none transition-colors focus:border-primary";

export const selectClass =
  `${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center] pr-8`;
