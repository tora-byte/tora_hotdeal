import { AdminDealTable } from "@/components/admin-deal-table";
import { pendingDeals } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-[var(--brand)]">관리자</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">게시글 승인 및 TOP5 선정</h1>
      </div>
      <AdminDealTable deals={pendingDeals} />
    </div>
  );
}
