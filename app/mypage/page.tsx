import { DealCard } from "@/components/deal-card";
import { myDeals, currentUser } from "@/lib/mock-data";
import { formatWon } from "@/lib/format";

export default function MyPage() {
  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-[var(--brand)]">마이페이지</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">{currentUser.name}님의 활동</h1>
      </div>

      <section className="mb-8 grid gap-3 sm:grid-cols-2">
        <div className="border border-[var(--line)] bg-white p-5">
          <p className="text-sm font-bold text-slate-500">누적 포인트</p>
          <strong className="mt-2 block text-3xl">{formatWon(currentUser.totalPoints).replace("원", "P")}</strong>
        </div>
        <div className="border border-[var(--line)] bg-white p-5">
          <p className="text-sm font-bold text-slate-500">출금 가능 포인트</p>
          <strong className="mt-2 block text-3xl text-[var(--brand)]">
            {formatWon(currentUser.withdrawablePoints).replace("원", "P")}
          </strong>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-black">내 게시글</h2>
        <div className="grid gap-3">
          {myDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} showStatus />
          ))}
        </div>
      </section>
    </div>
  );
}
