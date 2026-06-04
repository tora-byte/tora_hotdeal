"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { getMallName } from "@/lib/deals";
import { formatWon } from "@/lib/format";

type ProductPreview = {
  finalUrl: string;
  productId: string | null;
  mall: string;
  title: string | null;
  imageUrl: string | null;
  originalPrice: number | null;
  currentPrice: number | null;
  discountAmount: number | null;
  discountRate: number | null;
};

type PricePreview = {
  originalPrice: number;
  currentPrice: number;
  discountAmount: number;
  discountRate: number;
};

type PreviewState = "idle" | "loading" | "success" | "error";

export function DealSubmitForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [pricePreview, setPricePreview] = useState<PricePreview | null>(null);
  const [previewMall, setPreviewMall] = useState("");
  const [previewState, setPreviewState] = useState<PreviewState>("idle");
  const [submitted, setSubmitted] = useState(false);

  const fallbackMall = useMemo(() => getMallName(url), [url]);
  const mall = previewMall || fallbackMall;

  useEffect(() => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setPreviewMall("");
      setImagePreviewUrl(null);
      setPricePreview(null);
      setPreviewState("idle");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setPreviewMall("");
      setImagePreviewUrl(null);
      setPricePreview(null);
      setPreviewState("idle");
      return;
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setPreviewState("loading");

      try {
        const response = await fetch(`/api/product-preview?url=${encodeURIComponent(trimmedUrl)}`, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product preview");
        }

        const preview = (await response.json()) as ProductPreview;

        setPreviewMall(preview.mall);
        setImagePreviewUrl(preview.imageUrl);
        setPricePreview(getPricePreview(preview));

        if (preview.title) {
          setTitle((currentTitle) => currentTitle || preview.title || "");
        }

        setPreviewState("success");
      } catch {
        if (!abortController.signal.aborted) {
          setPreviewMall("");
          setImagePreviewUrl(null);
          setPricePreview(null);
          setPreviewState("error");
        }
      }
    }, 500);

    return () => {
      abortController.abort();
      window.clearTimeout(timeoutId);
    };
  }, [url]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-[var(--line)] bg-white p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          상품명
          <input
            required
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="focus-ring border border-[var(--line)] px-3 py-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          상품 URL
          <input
            required
            type="url"
            name="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="focus-ring border border-[var(--line)] px-3 py-3 font-normal"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold">
        상품 이미지 업로드
        <input
          type="file"
          name="image"
          accept="image/*"
          className="focus-ring border border-dashed border-[var(--line)] px-3 py-3 font-normal"
        />
      </label>

      {imagePreviewUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden border border-[var(--line)] bg-slate-100 sm:max-w-sm">
          <Image src={imagePreviewUrl} alt="" fill sizes="384px" className="object-cover" />
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-bold">
        설명
        <textarea
          required
          name="description"
          rows={5}
          className="focus-ring resize-y border border-[var(--line)] px-3 py-3 font-normal"
        />
      </label>

      <section className="grid gap-3 bg-slate-50 p-4 text-sm sm:grid-cols-4">
        <div>
          <p className="font-bold text-slate-500">쇼핑몰명</p>
          <strong>{mall}</strong>
        </div>
        {pricePreview ? (
          <>
            <div>
              <p className="font-bold text-slate-500">원가</p>
              <strong>{formatWon(pricePreview.originalPrice)}</strong>
            </div>
            <div>
              <p className="font-bold text-slate-500">할인가</p>
              <strong>{formatWon(pricePreview.currentPrice)}</strong>
            </div>
            <div>
              <p className="font-bold text-slate-500">할인</p>
              <strong>
                {formatWon(pricePreview.discountAmount)} / {pricePreview.discountRate}%
              </strong>
            </div>
          </>
        ) : null}
      </section>

      {previewState === "loading" ? <p className="text-sm font-bold text-slate-500">상품 정보를 불러오는 중입니다.</p> : null}
      {previewState === "success" && !pricePreview ? (
        <p className="text-sm font-bold text-slate-500">가격 정보 자동 추출 실패</p>
      ) : null}
      {previewState === "error" ? (
        <p className="text-sm font-bold text-slate-500">상품 정보를 자동으로 불러오지 못했습니다.</p>
      ) : null}
      {submitted ? (
        <p className="text-sm font-bold text-emerald-700">등록 요청이 생성되었습니다. 관리자 승인 후 공개됩니다.</p>
      ) : null}

      <button type="submit" className="focus-ring bg-[var(--brand)] px-4 py-3 font-black text-white">
        핫딜 등록
      </button>
    </form>
  );
}

function getPricePreview(preview: ProductPreview) {
  const { originalPrice, currentPrice, discountAmount, discountRate } = preview;

  if (
    typeof originalPrice !== "number" ||
    typeof currentPrice !== "number" ||
    typeof discountAmount !== "number" ||
    typeof discountRate !== "number"
  ) {
    return null;
  }

  return {
    originalPrice,
    currentPrice,
    discountAmount,
    discountRate
  };
}
