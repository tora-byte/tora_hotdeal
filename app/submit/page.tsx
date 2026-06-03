import { DealSubmitForm } from "@/components/deal-submit-form";

export default function SubmitPage() {
  return (
    <div className="container py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-[var(--brand)]">핫딜 등록</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">좋은 핫딜을 공유해주세요</h1>
      </div>
      <DealSubmitForm />
    </div>
  );
}
