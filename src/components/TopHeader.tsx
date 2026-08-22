import React, { useState, useEffect } from "react";
import { Lock, Sparkles, Copy, Calculator, Bookmark, Check } from "lucide-react";

interface TopHeaderProps {
  onLock: () => void;
  onOpenConsult: () => void;
  onOpenSummary: () => void;
  onOpenCalculator: () => void;
  bookmarkCount: number;
  onShowBookmarks: () => void;
  baseRate?: string;
  exchangeRate?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onLock,
  onOpenConsult,
  onOpenSummary,
  onOpenCalculator,
  bookmarkCount,
  onShowBookmarks,
  baseRate = "2.75",
  exchangeRate = "1,388.50",
}) => {
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [copiedQuick, setCopiedQuick] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateParts = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      }).format(now);

      const timeFormatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      setDateStr(dateParts);
      setTimeStr(timeFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b1c35] text-white border-b border-slate-700/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#top" className="flex flex-col">
            <span className="text-sm sm:text-base tracking-[0.2em] font-black uppercase flex items-center gap-1.5 font-serif">
              CEO MORNING <span className="text-[#f25c2a]">BRIEF</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider">
              중소·중견기업 최고경영자 전용 실시간 정보망
            </span>
          </a>
        </div>

        {/* Live Clock & Indicators (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">{dateStr}</span>
            <span className="font-mono font-bold text-amber-300 bg-slate-900/60 px-1.5 py-0.5 rounded">
              SEOUL {timeStr}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">기준금리</span>
            <span className="font-bold text-[#f25c2a]">{baseRate}%</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">환율</span>
            <span className="font-bold text-slate-200">{exchangeRate}원</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
            title="CEO 요약본 복사 및 공유"
          >
            <Copy className="w-3.5 h-3.5 text-[#f25c2a]" />
            <span className="hidden sm:inline">보고서 복사</span>
          </button>

          <button
            type="button"
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
            title="자격 요건 간이 자가진단"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">자가진단</span>
          </button>

          <button
            type="button"
            onClick={onOpenConsult}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f25c2a] hover:bg-[#ea580c] text-white transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 자문</span>
          </button>

          <button
            type="button"
            onClick={onShowBookmarks}
            className={`relative p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              bookmarkCount > 0
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title="스크랩한 공고 보기"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f25c2a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onLock}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
            title="화면 잠금"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
