"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleLoginButton() {
  async function handleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/mypage`
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="focus-ring mt-6 w-full border border-[var(--line)] bg-white px-4 py-3 font-black hover:bg-slate-50"
    >
      Google로 로그인
    </button>
  );
}
