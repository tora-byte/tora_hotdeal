import { calculateDiscount } from "@/lib/deals";
import { formatWon } from "@/lib/format";
import type { Deal } from "@/lib/types";

type AdminDealTableProps = {
  deals: Deal[];
};

export function AdminDealTable({ deals }: AdminDealTableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--line)] bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3">상품</th>
            <th className="p-3">쇼핑몰</th>
            <th className="p-3">할인</th>
            <th className="p-3">추천</th>
            <th className="p-3">상태</th>
            <th className="p-3">작업</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => {
            const discount = calculateDiscount(deal.originalPrice, deal.salePrice);

            return (
              <tr key={deal.id} className="border-t border-[var(--line)]">
                <td className="p-3">
                  <a href={deal.url} target="_blank" rel="noreferrer" className="font-black hover:text-[var(--brand)]">
                    {deal.title}
                  </a>
                  <p className="mt-1 text-slate-500">{formatWon(deal.salePrice)}</p>
                </td>
                <td className="p-3">{deal.mall}</td>
                <td className="p-3">
                  <strong className="text-[var(--brand)]">{discount.discountRate}%</strong>
                  <p className="text-slate-500">{formatWon(discount.discountAmount)}</p>
                </td>
                <td className="p-3">{deal.votes}</td>
                <td className="p-3">승인 대기</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button className="focus-ring bg-emerald-700 px-3 py-2 font-bold text-white">승인</button>
                    <button className="focus-ring bg-slate-800 px-3 py-2 font-bold text-white">반려</button>
                    <button className="focus-ring border border-[var(--line)] px-3 py-2 font-bold">TOP5</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
