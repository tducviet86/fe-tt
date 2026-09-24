"use client";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
type Photo = {
  media: { url: string; altVi: string | null; altEn: string | null };
};
export function DetailGallery({
  photos,
  title,
  locale,
}: {
  photos: Photo[];
  title: string;
  locale: "vi" | "en";
}) {
  const [active, setActive] = useState<number | null>(null);
  const vi = locale === "vi";
  if (!photos.length)
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-[#e5ebf1] p-8 text-center text-slate-500">
        <Images size={32} />
        <p>
          {vi
            ? "Ảnh căn hộ đang được cập nhật"
            : "Apartment photos are being updated"}
        </p>
      </div>
    );
  return (
    <>
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
        {photos.slice(0, 3).map((p, i) => (
          <button
            key={`${p.media.url}-${i}`}
            onClick={() => setActive(i)}
            aria-label={`${vi ? "Xem ảnh" : "View photo"} ${i + 1}: ${title}`}
            className={`relative overflow-hidden rounded-xl bg-slate-200 ${i === 0 ? "aspect-[4/3] md:row-span-2" : "hidden min-h-40 md:block"}`}
          >
            <Image
              fill
              src={p.media.url}
              alt={p.media[vi ? "altVi" : "altEn"] ?? title}
              preload={i === 0}
              sizes={i === 0 ? "(min-width:768px) 60vw,100vw" : "35vw"}
              className="object-cover transition-transform duration-200 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>
      <button
        className="mt-3 flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm"
        onClick={() => setActive(0)}
      >
        <Images size={16} />
        {vi ? "Xem toàn bộ ảnh" : "View all photos"} ({photos.length})
      </button>
      <Dialog.Root
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-slate-950/90" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-4 z-[81] flex flex-col rounded-xl p-3 text-white"
          >
            <div className="flex items-center justify-between gap-4">
              <Dialog.Title className="text-sm">
                {title} · {(active ?? 0) + 1}/{photos.length}
              </Dialog.Title>
              <Dialog.Close
                aria-label={vi ? "Đóng ảnh" : "Close gallery"}
                className="p-3"
              >
                <X />
              </Dialog.Close>
            </div>
            <div className="relative min-h-0 flex-1">
              {active !== null && (
                <Image
                  fill
                  src={photos[active].media.url}
                  alt={photos[active].media[vi ? "altVi" : "altEn"] ?? title}
                  sizes="95vw"
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex justify-center gap-8 py-3">
              <button
                disabled={photos.length < 2}
                aria-label={vi ? "Ảnh trước" : "Previous photo"}
                onClick={() =>
                  setActive(
                    (a) => ((a ?? 0) - 1 + photos.length) % photos.length,
                  )
                }
              >
                <ChevronLeft />
              </button>
              <button
                disabled={photos.length < 2}
                aria-label={vi ? "Ảnh tiếp" : "Next photo"}
                onClick={() => setActive((a) => ((a ?? 0) + 1) % photos.length)}
              >
                <ChevronRight />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
