export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <p className="eyebrow">ABC Apartment Operations</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">{title}</h1>
      <div className="mt-10 rounded-2xl bg-white p-10 shadow-sm">
        <p className="text-muted">{description}</p>
      </div>
    </>
  );
}
