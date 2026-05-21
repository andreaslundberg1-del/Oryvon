"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("CRITICAL ERROR: Supabase environment variables are missing. Please restart the dev server.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/admin");
        return; // Don't set loading to false if we are redirecting
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-black/60 border border-white/10 p-10 rounded-2xl backdrop-blur-xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        
        <h2 className="font-mono text-2xl tracking-[0.2em] text-amber-500 mb-2 text-center">OVERSEER</h2>
        <p className="font-mono text-[9px] text-white/40 tracking-widest text-center mb-10 uppercase">Identity Verification Required</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/60 tracking-widest uppercase">Operator Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/80 border border-white/10 rounded-lg py-3 px-4 font-mono text-[11px] text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/60 tracking-widest uppercase">Clearance Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/80 border border-white/10 rounded-lg py-3 px-4 font-mono text-[11px] text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded font-mono text-[10px] text-center mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 py-3 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "INITIALIZE UPLINK"}
          </button>
        </form>
      </div>
    </div>
  );
}
