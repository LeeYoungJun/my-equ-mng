export default function PageHeader({ title, description }) {
  return (
    <header className="mb-7">
      <h1
        className="text-[28px] font-semibold"
        style={{ color: "#1d1d1f", letterSpacing: "-0.5px", lineHeight: 1.1 }}
      >
        {title}
      </h1>
      {description && (
        <p
          className="mt-1.5 text-[14px]"
          style={{ color: "rgba(0,0,0,0.48)", letterSpacing: "-0.1px" }}
        >
          {description}
        </p>
      )}
    </header>
  );
}
