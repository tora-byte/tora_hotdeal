import { DealCard } from "@/components/deal-card";
import { SectionHeader } from "@/components/section-header";
import { approvedDeals, latestDeals, popularDeals, topDeals } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="container py-6 sm:py-8">
      <section className="mb-8 border-b border-[var(--line)] pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[var(--brand)]">오늘의 핫딜 커뮤니티</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              검증된 반값 딜만 빠르게 확인하세요
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="border border-[var(--line)] bg-white p-3">
              <strong className="block text-lg">{approvedDeals.length}</strong>
              승인 딜
            </div>
            <div className="border border-[var(--line)] bg-white p-3">
              <strong className="block text-lg">3개</strong>
              일 등록 제한
            </div>
            <div className="border border-[var(--line)] bg-white p-3">
              <strong className="block text-lg">100P</strong>
              승인 보상
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="오늘의 TOP5 핫딜" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {topDeals.map((deal, index) => (
            <DealCard key={deal.id} deal={deal} rank={index + 1} compact />
          ))}
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <SectionHeader title="최신 핫딜 목록" />
          <div className="grid gap-3">
            {latestDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="인기 핫딜 목록" />
          <div className="grid gap-3">
            {popularDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
