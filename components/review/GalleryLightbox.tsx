"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
export function GalleryLightbox({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }
  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <section className="space-y-4" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-xl font-bold">
        More photos
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => openAt(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`View photo ${i + 1} of ${images.length}`}
          >
            <Image
              src={url}
              alt={`${title} — photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                View
              </span>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal
          aria-label={`Photo ${index + 1} of ${images.length}`}
        >
          {/* Stop clicks on the image from closing */}
          <div
            className="relative flex max-h-[90vh] max-w-5xl w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={images[index]}
                alt={`${title} — photo ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {index + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
