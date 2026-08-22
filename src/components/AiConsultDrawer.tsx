import React, { useState } from "react";
import { X, Send, Sparkles, Bot, User, RefreshCw, HelpCircle, CheckCircle2 } from "lucide-react";

interface AiConsultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "연매출 20~50억 제조업 추천 저금리 정책자금 알려줘",
  "수출바우처 신청 시 가점 획득 팁과 필수 서류는?",
  "스마트공장 구축 시 국비 지원 한도 및 자부담 비율은?",
  "신용보증기금(신보)과 기술보증기금(기보) 중 어디가 유리한가요?",
];

export const AiConsultDrawer: React.FC<AiConsultDrawerProps> = ({
  isOpen,
  onClose,
  initialQuestion = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하십니까, 대표님. CEO 전담 정책자금 및 경제 전략 AI 수석자문위원입니다.\n\n관심 있으신 정책자금의 신청 자격, 심사 통과 노하우, 재무제표 관리 기준, 또는 거시경제 대응 전략에 대해 무엇이든 편하게 질문해 주십시오.",
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);

  // Sync initial question if changed
  React.useEffect(() => {
    if (initialQuestion && isOpen) {
      setInput(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) throw new Error("서버 응답 오류");
      const data = await res.json();

      const aiMsg: Message = {
        role: "assistant",
        content: data.answer || "답변을 불러오지 못했습니다.",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "자문 생성 중 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.",
          timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col font-sans">
        {/* Drawer Header */}
        <div className="bg-[#0b1c35] text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f25c2a] flex items-center justify-center text-white shadow-md shadow-orange-950/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2 font-serif">
                <span>CEO AI 정책자금 자문실</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  ACTIVE
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                중소·중견기업 경영진 맞춤 심층 솔루션
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="bg-slate-50 p-3 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#f8f7f4]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-[#0b1c35] text-[#f25c2a] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.role === "user"
                    ? "bg-[#f25c2a] text-white rounded-br-xs"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`mt-2 text-[10px] text-right ${
                    msg.role === "user" ? "text-orange-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-[#f25c2a]" />
              <span>실시간 정책 DB 및 심사 가이드라인을 분석 중입니다...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 제조업 20억 매출 시 받을 수 있는 스마트공장 자금은?"
              className="flex-1 h-12 px-4 text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-[#0b1c35] focus:ring-2 focus:ring-[#0b1c35]/15 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-[#0b1c35] hover:bg-[#142d4d] text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#f25c2a]" />
            </button>
          </form>
          <p className="mt-2 text-[11px] text-slate-400 text-center">
            * 공식 신청 전 해당 정책기관(중진공 1357, 신보 1588-6565)에 최종 상담을 권장합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
