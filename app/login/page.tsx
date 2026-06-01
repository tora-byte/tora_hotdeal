import { GoogleLoginButton } from "@/components/google-login-button";

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-56px)] items-center justify-center py-8">
      <section className="w-full max-w-md border border-[var(--line)] bg-white p-6">
        <p className="text-sm font-bold text-[var(--brand)]">로그인</p>
        <h1 className="mt-2 text-2xl font-black">Google 계정으로 시작하기</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Supabase Auth 기반 Google OAuth로 로그인합니다. 승인된 딜 등록과 포인트 관리를 위해 계정이 필요합니다.
        </p>
        <GoogleLoginButton />
      </section>
    </div>
  );
}
