import Image from "next/image";
import { calculateDiscount } from "@/lib/deals";
import { formatDate, formatWon } from "@/lib/format";
import type { Deal } from "@/lib/types";

type DealCardProps = {
  deal: Deal;
  rank?: number;
  compact?: boolean;
  showStatus?: boolean;
};

const statusLabel = {
  pending: "승인 대기",
  approved: "승인됨",
  rejected: "반려됨"
};

export function DealCard({ deal, rank, compact = false, showStatus = false }: DealCardProps) {
  const discount = calculateDiscount(deal.originalPrice, deal.salePrice);

  return (
    <article className="grid grid-cols-[96px_1fr] gap-3 border border-[var(--line)] bg-white p-3 sm:grid-cols-[128px_1fr]">
      <a
        href={deal.url}
        target="_blank"
        rel="noreferrer"
        className="focus-ring relative aspect-square overflow-hidden bg-slate-100"
        aria-label={`${deal.title} 상품 보기`}
      >
        <Image src={deal.imageUrl} alt="" fill sizes="160px" className="object-cover" />
        {rank ? (
          <span className="absolute left-2 top-2 bg-[var(--brand)] px-2 py-1 text-xs font-black text-white">
            TOP {rank}
          </span>
        ) : null}
      </a>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
          <span className="border border-[var(--line)] px-2 py-1">{deal.mall}</span>
          <span>추천 {deal.votes}</span>
          <span>{formatDate(deal.createdAt)}</span>
          {showStatus ? <span>{statusLabel[deal.status]}</span> : null}
        </div>
        <a href={deal.url} target="_blank" rel="noreferrer" className="focus-ring block">
          <h3 className="line-clamp-2 text-base font-black sm:text-lg">{deal.title}</h3>
        </a>
        {!compact ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{deal.description}</p> : null}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-lg font-black text-[var(--brand)]">{discount.discountRate}%</span>
          <strong className="text-xl">{formatWon(deal.salePrice)}</strong>
          <span className="text-sm text-slate-500 line-through">{formatWon(deal.originalPrice)}</span>
          <span className="text-sm font-bold text-slate-600">{formatWon(discount.discountAmount)} 할인</span>
        </div>
      </div>
    </article>
  );
}
