import { StayLoader } from "@/components/ui/stay-loader";
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f3efe5]">
      <div className="route-loading-line" />
      <header className="border-b border-black/8">
        <div className="container-site flex h-20 items-center">
          <div className="soft-skeleton h-9 w-44 rounded-full" />
        </div>
      </header>
      <div className="container-site py-10">
        <div className="mb-12 flex min-h-52 flex-col items-center justify-center rounded-[28px] bg-[#173f34] text-white">
          <StayLoader label="Đang tìm căn phù hợp nhất" />
          <p className="mt-5 text-xs text-white/55">
            Kiểm tra lịch trống và mức giá mới nhất
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[26px] border border-black/5 bg-[#fffdf8]"
            >
              <div className="soft-skeleton aspect-[16/11]" />
              <div className="space-y-4 p-5">
                <div className="soft-skeleton h-3 w-1/3 rounded-full" />
                <div className="soft-skeleton h-8 w-2/3 rounded-full" />
                <div className="soft-skeleton h-4 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
