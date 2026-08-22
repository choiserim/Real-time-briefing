import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Lock, KeyRound, CheckCircle2 } from "lucide-react";

interface AccessGateProps {
  onUnlock: () => void;
}

const CORRECT_CODE = "2221232";

export const AccessGate: React.FC<AccessGateProps> = ({ onUnlock }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === CORRECT_CODE) {
      setIsSubmitting(true);
      setError(false);
      setTimeout(() => {
        onUnlock();
      }, 300);
    } else {
      setError(true);
      setCode("");
    }
  };

  const handleQuickDemo = () => {
    setCode(CORRECT_CODE);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1c35] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Ambient Geometry */}
      <div className="absolute -top-40 -right-40 w-[620px] height-[620px] rounded-full border border-white/10 pointer-events-none shadow-[0_0_0_80px_rgba(255,255,255,0.03),0_0_0_160px_rgba(255,255,255,0.015)]" />
      <div className="absolute -bottom-40 -left-40 w-[380px] height-[380px] rounded-full border border-white/10 pointer-events-none shadow-[0_0_0_60px_rgba(255,255,255,0.02)]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#f25c2a] text-xs font-semibold tracking-widest uppercase mb-3 border border-white/10">
            <Lock className="w-3.5 h-3.5" />
            Executive Only
          </div>
          <h2 className="text-sm uppercase tracking-[0.25em] font-extrabold text-slate-300">
            CEO MORNING <span className="text-[#f25c2a]">BRIEFING</span>
          </h2>
        </div>

        {/* Access Card */}
        <div className="bg-white text-[#142033] rounded-2xl shadow-2xl p-8 sm:p-10 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] tracking-widest font-extrabold text-[#f25c2a] uppercase">
              Private Security Gate
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              보안 인증
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c35] leading-snug">
            대표님 전용<br />실시간 경영 브리핑입니다.
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            전달받으신 접속코드를 입력해 주세요.<br />
            인증 즉시 오늘자 실시간 경제 뉴스 및 마감임박 정책자금을 확인하실 수 있습니다.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="accessCode" className="block text-xs font-bold text-slate-700 mb-2">
                접속코드 (PIN)
              </label>
              <div className="relative">
                <input
                  id="accessCode"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setError(false);
                  }}
                  placeholder="접속코드를 입력하세요 (예: 2221232)"
                  className={`w-full h-14 px-4 pr-12 text-lg bg-slate-50 border rounded-xl outline-none transition-all font-mono tracking-widest ${
                    error
                      ? "border-red-500 ring-2 ring-red-100 bg-red-50/50"
                      : "border-slate-300 focus:border-[#0b1c35] focus:ring-2 focus:ring-[#0b1c35]/15"
                  }`}
                  autoFocus
                />
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              {error && (
                <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1.5" role="alert">
                  <span>⚠️</span> 접속코드가 일치하지 않습니다. 다시 확인해 주세요.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#f25c2a] hover:bg-[#ea580c] text-white font-bold text-base rounded-xl transition-all flex items-center justify-between px-6 shadow-lg shadow-orange-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-70"
            >
              <span>{isSubmitting ? "인증 확인 중..." : "브리핑 접속하기"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-slate-500 hover:text-[#f25c2a] transition-colors flex items-center gap-1.5 cursor-pointer underline decoration-dotted underline-offset-4"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#f25c2a]" />
              인증코드 자동 입력 (체험용: 2221232)
            </button>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              실시간 데이터 연동 활성
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-6 tracking-wider">
          © CEO MORNING BRIEF · REAL-TIME EXECUTIVE INTELLIGENCE
        </p>
      </div>
    </div>
  );
};
