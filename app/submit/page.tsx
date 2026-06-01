import { DealSubmitForm } from "@/components/deal-submit-form";

export default function SubmitPage() {
  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-[var(--brand)]">핫딜 등록</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">50% 이상 또는 10만원 이상 할인 딜을 공유하세요</h1>
      </div>
      <DealSubmitForm />
    </div>
  );
}
