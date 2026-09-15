import { CalendarCheck, Hotel, TrendingUp, Users } from "lucide-react";
const stats = [
  ["Bookings this month", CalendarCheck],
  ["Occupancy", Hotel],
  ["Revenue", TrendingUp],
  ["New customers", Users],
] as const;
export default function Admin() {
  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1 className="mt-2 font-display text-5xl font-semibold">
            Dashboard
          </h1>
          <p className="mt-3 text-muted">
            Live metrics will appear when reporting endpoints are available.
          </p>
        </div>
        <button
          disabled
          title="Requires booking API"
          className="cursor-not-allowed rounded-xl bg-stone-300 px-5 py-3 text-sm font-semibold text-stone-600"
        >
          New booking
        </button>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {stats.map(([label, Icon]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <Icon className="text-forest" />
            <p className="mt-6 text-sm text-muted">{label}</p>
            <b className="mt-1 block text-xl">Not available</b>
            <p className="mt-1 text-xs text-muted">Awaiting reporting API</p>
          </div>
        ))}
      </div>
      <section className="mt-8 rounded-2xl bg-white p-6">
        <h2 className="font-display text-3xl font-semibold">
          Today’s arrivals
        </h2>
        <div className="mt-5 rounded-xl border border-dashed p-10 text-center text-muted">
          No arrival feed is connected. No sample bookings are shown.
        </div>
      </section>
    </>
  );
}
