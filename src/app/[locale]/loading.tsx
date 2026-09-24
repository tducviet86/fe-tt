export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#f8f9fb] px-5 py-6 text-[#263e56]"
      aria-busy="true"
    >
      <div className="route-loading-line" />
      <div className="mx-auto max-w-6xl">
        <p className="border-b border-slate-200 pb-6 text-sm font-bold tracking-widest">
          ABC APARTMENT.
        </p>
        <p role="status" className="py-7 text-sm">
          Đang tải nội dung… / Loading…
        </p>
        <div aria-hidden="true" className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5 py-7">
            <div className="soft-skeleton h-12 w-3/4 rounded" />
            <div className="soft-skeleton h-12 w-2/3 rounded" />
            <div className="soft-skeleton h-5 w-full rounded" />
            <div className="soft-skeleton h-12 w-40 rounded" />
          </div>
          <div className="soft-skeleton h-72 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
