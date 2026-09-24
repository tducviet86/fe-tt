import "./customer.css";
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="customer-site">{children}</div>;
}
