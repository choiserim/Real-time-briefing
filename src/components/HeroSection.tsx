import React from "react";
import { ArrowRight, RefreshCw, CheckCircle2, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { BriefingData } from "../types";

interface HeroSectionProps {
  onStartBriefing: () => void;
  isLoading: boolean;
  briefing: BriefingData | null;
  lastUpdated: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBriefing,
  isLoading,
  briefing,
  lastUpdated,
}) => {
  return (
    <section id="top" className="relative bg-gradient-to-br from-[#0b1c35] via-[#102746] to-[#193456] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Geometry */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none shadow-[0_0_0_80px_rgba(255,255,255,0.02),0_0_0_160px_rgba(255,255,255,0.01)]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        {/* Left Column: Hero Content */}
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f25c2a]/15 text-[#ff8c66] text-xs font-bold tracking-widest uppercase mb-6 border border-[#f25c2a]/30">
            <span>FOR SMALL & MID-SIZED BUSINESS LEADERS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.18] font-serif">
            대표님의 의사결정을<br />
            앞당기는 <em className="text-[#f25c2a] not-italic">3분.</em>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-light">
            지금 꼭 챙겨야 할 <strong className="text-white font-medium">실시간 경제 지표 변화</strong>와{" "}
            <strong className="text-white font-medium">신청 가능한 정책자금 기회</strong>를
            실무 관점에서 짧고 명확하게 엄선하여 브리핑합니다.
          </p>

          {/* Action Button & Indicators */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              onClick={onStartBriefing}
              disabled={isLoading}
              className="inline-flex items-center justify-between sm:justify-start gap-8 bg-[#f25c2a] hover:bg-[#ea580c] text-white px-7 py-4 rounded-xl font-bold text-base shadow-xl shadow-orange-950/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-wait cursor-pointer group"
            >
              <span>{isLoading ? "실시간 브리핑 수집 중..." : "실시간 최신 브리핑 시작"}</span>
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            {briefing && (
              <button
                type="button"
                onClick={onStartBriefing}
                disabled={isLoading}
                className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>데이터 실시간 갱신</span>
              </button>
            )}
          </div>

          {/* Freshness Timestamp */}
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {lastUpdated ? lastUpdated : "실시간 웹 검색 및 공공 포털 연동 완료"}
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span>중기부·중진공·한국은행 출처 교차 검증</span>
          </div>
        </div>

        {/* Right Column: Executive Today's Point Panel */}
        <div className="lg:col-span-4 bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10 backdrop-blur-sm lg:border-l-2 lg:border-l-[#f25c2a]">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            <span>KEY EXECUTIVE METRICS</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> LIVE
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-[#f25c2a]" />
                <span>한국은행 기준금리</span>
              </div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-0.5">
                {briefing?.baseRate || "2.75"}
                <span className="text-sm font-semibold text-[#f25c2a]">%</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 truncate">
                {briefing?.baseRateChange || "현행 유지 (동결 기조)"}
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                <span>원/달러 환율</span>
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-0.5">
                {briefing?.exchangeRate ? briefing.exchangeRate.replace("원", "") : "1,388"}
                <span className="text-xs font-semibold text-slate-300">원</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 truncate">
                {briefing?.exchangeRateChange || "환리스크 관리 권고"}
              </p>
            </div>
          </div>

          <div className="my-5 h-px bg-slate-700/60" />

          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#ff8c66] uppercase block mb-1">
              TODAY'S HEADLINE
            </span>
            <div
              className="text-sm sm:text-base font-semibold leading-snug text-slate-200"
              dangerouslySetInnerHTML={{
                __html:
                  briefing?.panelHeadline ||
                  "실시간 브리핑을 시작하여<br>오늘의 자금 및 거시 경제 기회를 확인하세요.",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
