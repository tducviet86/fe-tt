"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-5xl font-semibold">
          Đã có lỗi xảy ra
        </h1>
        <p className="mt-4 text-muted">Vui lòng thử lại sau ít phút.</p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-forest px-6 py-3 text-white"
        >
          Thử lại
        </button>
      </div>
    </main>
  );
}
