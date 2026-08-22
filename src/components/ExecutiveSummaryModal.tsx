import React, { useState } from "react";
import { X, Copy, Check, Printer, Share2, FileSpreadsheet } from "lucide-react";
import { BriefingData } from "../types";

interface ExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: BriefingData;
}

export const ExecutiveSummaryModal: React.FC<ExecutiveSummaryModalProps> = ({
  isOpen,
  onClose,
  briefing,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate plain text report
  const generateReportText = () => {
    let text = `[CEO MORNING BRIEF - ${briefing.reportDate || "실시간 브리핑"}]\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `■ 핵심 지표\n`;
    text += `- 한국은행 기준금리: ${briefing.baseRate}%\n`;
    text += `- 원/달러 환율: ${briefing.exchangeRate || "1,388원"}\n\n`;

    if (briefing.todayPoint) {
      text += `■ 오늘의 CEO 실무 포인트\n`;
      text += `${briefing.todayPoint}\n\n`;
    }

    if (briefing.macroNews && briefing.macroNews.length > 0) {
      text += `■ 주요 거시경제 뉴스\n`;
      briefing.macroNews.forEach((item, idx) => {
        text += `${idx + 1}. ${item.title}\n   - ${item.desc}\n   - 출처: ${item.source} (${item.url})\n`;
      });
      text += `\n`;
    }

    if (briefing.exportFunding && briefing.exportFunding.length > 0) {
      text += `■ 제조업·수출기업 주요 정책자금\n`;
      briefing.exportFunding.forEach((fund, idx) => {
        text += `${idx + 1}. ${fund.title} [${fund.deadline}]\n   - 지원: ${fund.budget} (${fund.target})\n   - 공고: ${fund.url}\n`;
      });
      text += `\n`;
    }

    if (briefing.startupFunding && briefing.startupFunding.length > 0) {
      text += `■ 중소기업·스타트업 주요 정책자금\n`;
      briefing.startupFunding.forEach((fund, idx) => {
        text += `${idx + 1}. ${fund.title} [${fund.deadline}]\n   - 지원: ${fund.budget} (${fund.target})\n   - 공고: ${fund.url}\n`;
      });
      text += `\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `* CEO Morning Briefing 시스템 제공`;
    return text;
  };

  const handleCopy = () => {
    const text = generateReportText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0b1c35] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#ff8c66] uppercase tracking-widest block">
              EXECUTIVE REPORT EXPORT
            </span>
            <h3 className="text-lg font-bold font-serif">
              경영진 보고용 요약본 내보내기
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6">
          <p className="text-xs text-slate-600 mb-3">
            카카오톡, 슬랙, 사내 메신저 또는 이메일로 경영진 및 실무 부서에 원클릭 전송 가능한 텍스트 포맷입니다.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
            {generateReportText()}
          </div>

          {/* Action Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>보고서 인쇄 (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f25c2a] hover:bg-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-orange-950/20 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>클립보드 복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>전체 텍스트 복사하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
