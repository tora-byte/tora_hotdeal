"use client";

import { FormEvent, useMemo, useState } from "react";
import { getMallName } from "@/lib/deals";

export function DealSubmitForm() {
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mall = useMemo(() => getMallName(url), [url]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
          <p className="font-bold text-slate-500">쇼핑몰명</p>
          <strong>{mall}</strong>
        </div>
      </section>

      {submitted ? (
        <p className="text-sm font-bold text-emerald-700">등록 요청이 생성되었습니다. 관리자 승인 후 공개됩니다.</p>
      ) : null}

      <button type="submit" className="focus-ring bg-[var(--brand)] px-4 py-3 font-black text-white">
        핫딜 등록
      </button>
    </form>
  );
}
