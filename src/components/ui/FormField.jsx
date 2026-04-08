export default function FormField({ label, htmlFor, children }) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="block text-[12px] font-semibold mb-1.5"
        style={{ color: "rgba(0,0,0,0.48)", letterSpacing: "-0.1px" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full px-3.5 py-2.5 rounded-[11px] border-[1.5px] border-gray-200 bg-[#fafafc] text-[14px] text-[#1d1d1f] font-[inherit] outline-none transition-colors focus:border-[#0071e3] focus:bg-white";

export const selectClass =
  `${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center] pr-8`;
