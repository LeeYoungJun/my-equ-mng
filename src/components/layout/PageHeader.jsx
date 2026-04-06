export default function PageHeader({ title, description }) {
  return (
    <header className="mb-6">
      <h1 className="text-[22px] font-extrabold text-dark">{title}</h1>
      {description && <p className="mt-1 text-[13px] text-gray-400">{description}</p>}
    </header>
  );
}
