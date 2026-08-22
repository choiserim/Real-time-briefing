import React, { useState, useEffect } from "react";
import { AccessGate } from "./components/AccessGate";
import { TopHeader } from "./components/TopHeader";
import { HeroSection } from "./components/HeroSection";
import { AudioBriefingPlayer } from "./components/AudioBriefingPlayer";
import { MacroNewsSection } from "./components/MacroNewsSection";
import { PolicyFundingSection } from "./components/PolicyFundingSection";
import { AiConsultDrawer } from "./components/AiConsultDrawer";
import { ExecutiveSummaryModal } from "./components/ExecutiveSummaryModal";
import { EligibilityCalculatorModal } from "./components/EligibilityCalculatorModal";
import { BriefingData, CategoryFilter, FundingItem } from "./types";
import {
  Sparkles,
  Search,
  Bookmark,
  CheckCircle2,
  Clock,
  Layers,
  ArrowDown,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem("ceo_brief_unlocked") === "true";
  });

  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<FundingItem[]>(() => {
    try {
      const saved = localStorage.getItem("ceo_brief_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [consultQuestion, setConsultQuestion] = useState("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const bookmarkedIds = new Set(bookmarks.map((b) => b.id));

  const handleUnlock = () => {
    sessionStorage.setItem("ceo_brief_unlocked", "true");
    setIsUnlocked(true);
    // Auto load briefing upon initial unlock if not loaded
    if (!briefing) {
      fetchBriefing();
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem("ceo_brief_unlocked");
    setIsUnlocked(false);
  };

  const fetchBriefing = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`서버 응답 오류 (${res.status})`);
      }

      const data: BriefingData = await res.json();
      setBriefing(data);

      const now = new Date();
      const timeKST = new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      setLastUpdated(`${timeKST} 서울 기준 실시간 수집 완료`);

      // Scroll smoothly to briefing area after loading
      setTimeout(() => {
        const el = document.getElementById("briefing-view");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err: any) {
      console.error("Failed to fetch briefing:", err);
      setError(err.message || "브리핑을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle bookmark
  const handleToggleBookmark = (item: FundingItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      let updated: FundingItem[];
      if (exists) {
        updated = prev.filter((b) => b.id !== item.id);
      } else {
        updated = [...prev, item];
      }
      try {
        localStorage.setItem("ceo_brief_bookmarks", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage error", e);
      }
      return updated;
    });
  };

  const handleAskAi = (question: string) => {
    setConsultQuestion(question);
    setIsConsultOpen(true);
  };

  // If locked, show Access Gate
  if (!isUnlocked) {
    return <AccessGate onUnlock={handleUnlock} />;
  }

  // Filter items based on active category & search query
  const matchesSearch = (text?: string) => {
    if (!searchQuery.trim()) return true;
    return (text || "").toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  const filteredMacroNews = (briefing?.macroNews || []).filter(
    (item) =>
      (activeCategory === "ALL" || activeCategory === "MACRO") &&
      (matchesSearch(item.title) || matchesSearch(item.desc) || matchesSearch(item.tag))
  );

  const filteredExportFunding = (briefing?.exportFunding || []).filter((item) => {
    const catMatch =
      activeCategory === "ALL" ||
      activeCategory === "EXPORT" ||
      (activeCategory === "URGENT" && item.urgent);
    return (
      catMatch &&
      (matchesSearch(item.title) ||
        matchesSearch(item.desc) ||
        matchesSearch(item.target) ||
        matchesSearch(item.agency))
    );
  });

  const filteredStartupFunding = (briefing?.startupFunding || []).filter((item) => {
    const catMatch =
      activeCategory === "ALL" ||
      activeCategory === "STARTUP" ||
      (activeCategory === "URGENT" && item.urgent);
    return (
      catMatch &&
      (matchesSearch(item.title) ||
        matchesSearch(item.desc) ||
        matchesSearch(item.target) ||
        matchesSearch(item.agency))
    );
  });

  const bookmarkedFundingItems = bookmarks.filter(
    (item) =>
      matchesSearch(item.title) ||
      matchesSearch(item.desc) ||
      matchesSearch(item.target) ||
      matchesSearch(item.agency)
  );

  const urgentCount = [
    ...(briefing?.exportFunding || []),
    ...(briefing?.startupFunding || []),
  ].filter((f) => f.urgent).length;

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#142033] flex flex-col font-sans selection:bg-[#f25c2a] selection:text-white">
      {/* Top Sticky Navigation */}
      <TopHeader
        onLock={handleLock}
        onOpenConsult={() => {
          setConsultQuestion("");
          setIsConsultOpen(true);
        }}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        bookmarkCount={bookmarks.length}
        onShowBookmarks={() => {
          setActiveCategory("BOOKMARKS");
          document.getElementById("briefing-view")?.scrollIntoView({ behavior: "smooth" });
        }}
        baseRate={briefing?.baseRate}
        exchangeRate={briefing?.exchangeRate}
      />

      {/* Hero Header */}
      <HeroSection
        onStartBriefing={fetchBriefing}
        isLoading={isLoading}
        briefing={briefing}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" id="briefing-view">
        {/* Loading State or Starter CTA */}
        {!briefing && !isLoading && !error && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#f25c2a] flex items-center justify-center mx-auto mb-4 border border-orange-100">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c35] font-serif">
              실시간 경제·정책자금 브리핑을 준비했습니다.
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              상단의 <strong className="text-[#f25c2a]">실시간 최신 브리핑 시작</strong> 버튼을 누르면
              오늘 기준 최신 공고와 거시 경제 지표를 바로 확인할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={fetchBriefing}
              className="mt-6 inline-flex items-center gap-2 bg-[#f25c2a] hover:bg-[#ea580c] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>지금 브리핑 불러오기</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl max-w-2xl mx-auto text-center my-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h4 className="font-bold text-base">브리핑을 불러오지 못했습니다</h4>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              type="button"
              onClick={fetchBriefing}
              className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Active Briefing View */}
        {briefing && (
          <div>
            {/* Audio TTS Briefing Component */}
            <AudioBriefingPlayer briefing={briefing} />

            {/* Briefing Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b-2 border-[#0b1c35] gap-4">
              <div>
                <p className="text-[11px] font-extrabold text-[#f25c2a] uppercase tracking-widest">
                  DAILY EXECUTIVE NOTE
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c35] tracking-tight mt-1 font-serif">
                  📅 {briefing.reportDate || "오늘자"} 경제·정책자금 브리핑
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="bg-slate-200/80 px-2.5 py-1 rounded font-medium text-slate-700">
                  READING TIME · 3 MIN
                </span>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveCategory("ALL")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "ALL"
                      ? "bg-white text-[#0b1c35] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  전체 보기
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("MACRO")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "MACRO"
                      ? "bg-white text-[#0b1c35] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📈 거시경제
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("EXPORT")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "EXPORT"
                      ? "bg-white text-[#0b1c35] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🏭 제조업·수출
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("STARTUP")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "STARTUP"
                      ? "bg-white text-[#0b1c35] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🚀 스타트업·중기
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("URGENT")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeCategory === "URGENT"
                      ? "bg-red-600 text-white shadow-xs"
                      : "text-red-700 hover:bg-red-100/60"
                  }`}
                >
                  <span>⏰ 마감임박</span>
                  {urgentCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-800 font-extrabold">
                      {urgentCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("BOOKMARKS")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeCategory === "BOOKMARKS"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-amber-800 hover:bg-amber-100/60"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>스크랩 ({bookmarks.length})</span>
                </button>
              </div>

              {/* Keyword Search Input */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="공고명, 지원대상, 키워드 검색..."
                  className="w-full h-10 pl-9 pr-4 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-[#0b1c35] focus:ring-1 focus:ring-[#0b1c35]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Sections */}
            {activeCategory !== "BOOKMARKS" && (
              <>
                {/* 01: Macro News */}
                {filteredMacroNews.length > 0 && (
                  <MacroNewsSection items={filteredMacroNews} onAskAi={handleAskAi} />
                )}

                {/* 02: Export & Manufacturing Funding */}
                {filteredExportFunding.length > 0 && (
                  <PolicyFundingSection
                    sectionNumber="02"
                    categoryCode="EXPORT & MANUFACTURING"
                    categoryTitle="정책자금 – 제조업·수출기업"
                    description="스마트공장, 수출바우처, 무역보험공사 및 신보/기보 제조 우대 자금"
                    items={filteredExportFunding}
                    bookmarkedIds={bookmarkedIds}
                    onToggleBookmark={handleToggleBookmark}
                    onAskAi={handleAskAi}
                  />
                )}

                {/* 03: Startup & Growth Funding */}
                {filteredStartupFunding.length > 0 && (
                  <PolicyFundingSection
                    sectionNumber="03"
                    categoryCode="STARTUP & GROWTH"
                    categoryTitle="정책자금 – 중소기업·스타트업"
                    description="중진공 혁신창업자금, TIPS, R&D 출연금 및 소상공인 정책자금"
                    items={filteredStartupFunding}
                    bookmarkedIds={bookmarkedIds}
                    onToggleBookmark={handleToggleBookmark}
                    onAskAi={handleAskAi}
                  />
                )}
              </>
            )}

            {/* Bookmarks Tab View */}
            {activeCategory === "BOOKMARKS" && (
              <div className="py-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0b1c35] font-serif flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span>대표님이 스크랩한 관심 정책자금 ({bookmarkedFundingItems.length})</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      신청 마감 전까지 언제든 빠르게 다시 확인하실 수 있도록 보관된 목록입니다.
                    </p>
                  </div>
                </div>

                {bookmarkedFundingItems.length === 0 ? (
                  <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
                    <p className="text-sm text-slate-500">스크랩한 공고가 없습니다.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      공고 우측 상단의 [스크랩] 버튼을 눌러 관심 정책자금을 저장해 보세요.
                    </p>
                  </div>
                ) : (
                  <PolicyFundingSection
                    sectionNumber="★"
                    categoryCode="SAVED BOOKMARKS"
                    categoryTitle="스크랩된 정책자금 모아보기"
                    description="저장해둔 정책자금 목록"
                    items={bookmarkedFundingItems}
                    bookmarkedIds={bookmarkedIds}
                    onToggleBookmark={handleToggleBookmark}
                    onAskAi={handleAskAi}
                  />
                )}
              </div>
            )}

            {/* Today's Point Callout */}
            {briefing.todayPoint && (
              <div className="mt-10 bg-[#0b1c35] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="shrink-0 flex items-center gap-2 text-sm font-extrabold text-[#ff8c66] uppercase tracking-wider bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
                  <Lightbulb className="w-4 h-4 text-amber-300" />
                  <span>오늘의 핵심 포인트</span>
                </div>
                <div className="text-sm sm:text-base leading-relaxed text-slate-200 whitespace-pre-line font-light">
                  {briefing.todayPoint}
                </div>
              </div>
            )}

            {/* Grounding & Verification Footnote */}
            {briefing.groundingSources && briefing.groundingSources.length > 0 && (
              <div className="mt-8 bg-white/60 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>공공기관 및 공식 출처 검증 내역:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {briefing.groundingSources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[11px] transition-colors"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating AI Consultant Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          type="button"
          onClick={() => {
            setConsultQuestion("");
            setIsConsultOpen(true);
          }}
          className="flex items-center gap-2.5 bg-[#0b1c35] hover:bg-[#142d4d] text-white px-5 py-3.5 rounded-full shadow-2xl border border-slate-600 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="CEO 전담 AI 정책자금 자문"
        >
          <div className="w-7 h-7 rounded-full bg-[#f25c2a] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            CEO AI 정책자금 자문
          </span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <AiConsultDrawer
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
        initialQuestion={consultQuestion}
      />

      {briefing && (
        <ExecutiveSummaryModal
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          briefing={briefing}
        />
      )}

      <EligibilityCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onConsult={(q) => {
          setConsultQuestion(q);
          setIsConsultOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="bg-[#e8e5dd] border-t border-slate-300 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-widest text-[#0b1c35] uppercase font-serif">
              CEO MORNING BRIEF
            </span>
            <span>·</span>
            <span>실시간 경제·정책자금 브리핑</span>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-500 max-w-xl">
            공식 정부 발표 및 주요 경제매체를 교차 확인한 정보 요약입니다. 지원 자금의 상세 요건과 예산 소진 여부는 최종 신청 전 반드시 주관기관 원문 공고를 확인하시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
