import Link from "next/link";
const tools = [
  ["Pages", "Edit metadata and publication", "/admin/seo/pages"],
  ["Redirects", "Manage permanent redirects", "/admin/seo/redirects"],
  ["Sitemap", "Review indexable URLs", "/admin/seo/sitemap"],
  ["Audit", "Find technical SEO issues", "/admin/seo/audit"],
];
export default function SeoAdmin() {
  return (
    <>
      <p className="eyebrow">Technical SEO</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">
        SEO workspace
      </h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {tools.map(([name, text, href]) => (
          <Link
            href={href}
            key={name}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-3xl font-semibold">{name}</h2>
            <p className="mt-2 text-muted">{text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
