import React from "react";
import { ExternalLink, Bookmark, Clock, DollarSign, Users, FileText, Sparkles, AlertCircle } from "lucide-react";
import { FundingItem } from "../types";

interface PolicyFundingSectionProps {
  sectionNumber: string;
  categoryCode: string;
  categoryTitle: string;
  description: string;
  items: FundingItem[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (item: FundingItem) => void;
  onAskAi: (question: string) => void;
}

export const PolicyFundingSection: React.FC<PolicyFundingSectionProps> = ({
  sectionNumber,
  categoryCode,
  categoryTitle,
  description,
  items,
  bookmarkedIds,
  onToggleBookmark,
  onAskAi,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <article className="border-b border-slate-300 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        {/* Section Header */}
        <div className="md:col-span-4 flex items-start gap-4">
          <span className="text-sm font-extrabold text-[#f25c2a] font-serif">{sectionNumber}</span>
          <div>
            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
              {categoryCode}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0b1c35] tracking-tight mt-1 font-serif">
              {categoryTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Funding Items List */}
        <div className="md:col-span-8 space-y-5">
          {items.map((item, index) => {
            const isBookmarked = bookmarkedIds.has(item.id);
            return (
              <div
                key={item.id || index}
                className={`bg-white rounded-xl p-5 sm:p-6 border transition-all shadow-sm hover:shadow-md ${
                  item.urgent
                    ? "border-orange-300 ring-1 ring-orange-200"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* Header & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {item.urgent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-md animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        마감임박
                      </span>
                    )}
                    {item.dDay !== undefined && item.dDay !== null && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        D-{item.dDay}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {item.agency}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(item)}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                      isBookmarked
                        ? "bg-amber-100 text-amber-800 font-bold"
                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                    title={isBookmarked ? "스크랩 취소" : "관심 공고 스크랩"}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 text-amber-600" : ""}`} />
                    <span className="text-[11px] hidden sm:inline">
                      {isBookmarked ? "스크랩됨" : "스크랩"}
                    </span>
                  </button>
                </div>

                {/* Title */}
                <h4 className="text-base sm:text-lg font-bold text-[#0b1c35] leading-snug">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#f25c2a] transition-colors flex items-start justify-between gap-2"
                  >
                    <span>{item.title}</span>
                    <ExternalLink className="w-4 h-4 shrink-0 text-slate-400 mt-1" />
                  </a>
                </h4>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                {/* Details Matrix */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-lg text-xs border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-[#f25c2a] shrink-0" />
                    <span className="text-slate-500 font-medium">지원규모:</span>
                    <strong className="font-bold text-[#0b1c35] truncate">{item.budget}</strong>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="text-slate-500 font-medium">접수기간:</span>
                    <span className="font-semibold text-slate-900 truncate">{item.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-slate-500 font-medium">지원대상:</span>
                    <span className="text-slate-800 font-medium truncate">{item.target}</span>
                  </div>

                  {item.keyRequirements && (
                    <div className="flex items-start gap-2 text-slate-700 sm:col-span-2 pt-1 border-t border-slate-200/60">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-slate-500 font-medium">핵심요건:</span>
                      <span className="text-slate-700">{item.keyRequirements}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#f25c2a] hover:text-[#ea580c] transition-colors"
                  >
                    <span>공식 공고 및 신청 바로가기</span>
                    <span>↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onAskAi(
                        `[정책자금 신청 자격 질의] 공고명: "${item.title}" (${item.agency})\n지원대상: ${item.target}\n지원규모: ${item.budget}\n우리 회사가 이 정책자금을 신청할 때 필요한 심사 기준, 통과 팁, 제출 서류 및 결격 사유를 상세히 분석해 주세요.`
                      )
                    }
                    className="inline-flex items-center gap-1.5 bg-[#0b1c35] hover:bg-[#142d4d] text-white px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>신청 적합도 AI 검토</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
};
