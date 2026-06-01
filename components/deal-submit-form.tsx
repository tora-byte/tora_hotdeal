"use client";

import { FormEvent, useMemo, useState } from "react";
import { calculateDiscount, getMallName } from "@/lib/deals";
import { formatWon } from "@/lib/format";

export function DealSubmitForm() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const original = Number(originalPrice) || 0;
  const sale = Number(salePrice) || 0;
  const discount = useMemo(() => calculateDiscount(original, sale), [original, sale]);
  const mall = useMemo(() => getMallName(url), [url]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!discount.isQualified) {
      return;
    }
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-[var(--line)] bg-white p-4 sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          상품명
          <input required name="title" className="focus-ring border border-[var(--line)] px-3 py-3 font-normal" />
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
        <label className="grid gap-2 text-sm font-bold">
          원가
          <input
            required
            min="0"
            type="number"
            name="originalPrice"
            value={originalPrice}
            onChange={(event) => setOriginalPrice(event.target.value)}
            className="focus-ring border border-[var(--line)] px-3 py-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          할인가
          <input
            required
            min="0"
            type="number"
            name="salePrice"
            value={salePrice}
            onChange={(event) => setSalePrice(event.target.value)}
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
          <p className="font-bold text-slate-500">쇼핑몰</p>
          <strong>{mall}</strong>
        </div>
        <div>
          <p className="font-bold text-slate-500">할인금액</p>
          <strong>{formatWon(discount.discountAmount)}</strong>
        </div>
        <div>
          <p className="font-bold text-slate-500">할인율</p>
          <strong>{discount.discountRate}%</strong>
        </div>
        <div>
          <p className="font-bold text-slate-500">등록 조건</p>
          <strong className={discount.isQualified ? "text-emerald-700" : "text-[var(--brand)]"}>
            {discount.isQualified ? "충족" : "미충족"}
          </strong>
        </div>
      </section>

      {!discount.isQualified ? (
        <p className="text-sm font-bold text-[var(--brand)]">
          할인율 50% 이상 또는 할인금액 100,000원 이상인 상품만 등록할 수 있습니다.
        </p>
      ) : null}
      {submitted ? (
        <p className="text-sm font-bold text-emerald-700">등록 요청이 생성되었습니다. 관리자 승인 후 공개됩니다.</p>
      ) : null}

      <button
        type="submit"
        disabled={!discount.isQualified}
        className="focus-ring bg-[var(--brand)] px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        승인 대기 게시글로 등록
      </button>
    </form>
  );
}
