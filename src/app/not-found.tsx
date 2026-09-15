import Link from "next/link";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream p-6 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-6xl font-semibold">
          Không tìm thấy trang
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Trang bạn tìm có thể đã chuyển địa chỉ hoặc không còn tồn tại.
        </p>
        <Link
          href="/vi"
          className="mt-8 inline-block rounded-full bg-forest px-6 py-3 font-semibold text-white"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
