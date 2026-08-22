import React from "react";
import { ExternalLink, TrendingUp, Lightbulb, MessageSquare } from "lucide-react";
import { MacroNewsItem } from "../types";

interface MacroNewsSectionProps {
  items: MacroNewsItem[];
  onAskAi: (question: string) => void;
}

export const MacroNewsSection: React.FC<MacroNewsSectionProps> = ({ items, onAskAi }) => {
  if (!items || items.length === 0) return null;

  return (
    <article className="border-b border-slate-300 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        {/* Left Section Header */}
        <div className="md:col-span-4 flex items-start gap-4">
          <span className="text-sm font-extrabold text-[#f25c2a] font-serif">01</span>
          <div>
            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
              MACRO & MARKET
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0b1c35] tracking-tight mt-1 font-serif">
              실시간 경제 뉴스
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              한국은행, 기획재정부 및 주요 경제지 발표를 교차 검증한 거시 지표 분석입니다.
            </p>
          </div>
        </div>

        {/* Right News List */}
        <div className="md:col-span-8 space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-sm transition-all hover:shadow-md group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3 text-[#f25c2a]" />
                  {item.tag || "거시경제"}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  {item.source}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-[#142033] group-hover:text-[#f25c2a] transition-colors leading-snug">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center justify-between gap-2"
                >
                  <span>{item.title}</span>
                  <ExternalLink className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-[#f25c2a]" />
                </a>
              </h4>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>

              {item.impact && (
                <div className="mt-3.5 bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-900">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-normal">
                    <strong className="font-semibold text-amber-950">경영 실무 영향:</strong>{" "}
                    {item.impact}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-[#f25c2a] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>원문 기사 보기</span>
                  <span>↗</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    onAskAi(
                      `[경제뉴스 관련 질의] "${item.title}" 뉴스에 대해 우리 회사(중소기업) 입장에서 대응해야 할 구체적인 실무 전략과 방어 대책을 자문해 주세요.`
                    )
                  }
                  className="text-slate-600 hover:text-[#0b1c35] flex items-center gap-1 font-medium bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3 text-[#f25c2a]" />
                  <span>AI 맞춤 대응 자문</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
