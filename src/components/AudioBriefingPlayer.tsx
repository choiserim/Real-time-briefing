import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, Sparkles } from "lucide-react";
import { BriefingData } from "../types";

interface AudioBriefingPlayerProps {
  briefing: BriefingData;
}

export const AudioBriefingPlayer: React.FC<AudioBriefingPlayerProps> = ({ briefing }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.2);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [speechQueue, setSpeechQueue] = useState<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Generate speech script from the briefing data
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    const scriptItems: string[] = [];
    scriptItems.push(`대표님을 위한 ${briefing.reportDate || "오늘자"} 실시간 경영 브리핑입니다.`);
    scriptItems.push(`오늘의 주요 지표입니다. 한국은행 기준금리는 ${briefing.baseRate} 퍼센트이며, 원 달러 환율은 ${briefing.exchangeRate || "1388원"} 선입니다.`);
    
    if (briefing.todayPoint) {
      scriptItems.push(`오늘의 핵심 전략 포인트입니다. ${briefing.todayPoint}`);
    }

    if (briefing.macroNews && briefing.macroNews.length > 0) {
      scriptItems.push("먼저 주요 거시 경제 뉴스입니다.");
      briefing.macroNews.forEach((news, idx) => {
        scriptItems.push(`${idx + 1}번 뉴스. ${news.title}. ${news.desc}`);
      });
    }

    if (briefing.exportFunding && briefing.exportFunding.length > 0) {
      scriptItems.push("다음은 제조업 및 수출기업 정책자금 공고입니다.");
      briefing.exportFunding.forEach((fund) => {
        scriptItems.push(`${fund.title}. 지원 규모는 ${fund.budget}이며, 마감일은 ${fund.deadline}입니다. ${fund.desc}`);
      });
    }

    if (briefing.startupFunding && briefing.startupFunding.length > 0) {
      scriptItems.push("중소기업 및 스타트업 대상 정책자금 공고입니다.");
      briefing.startupFunding.forEach((fund) => {
        scriptItems.push(`${fund.title}. 지원 규모는 ${fund.budget}이며, 대상은 ${fund.target}입니다.`);
      });
    }

    scriptItems.push("이상으로 대표님을 위한 3분 실시간 브리핑을 마칩니다. 성공적인 하루 되십시오.");
    setSpeechQueue(scriptItems);
  }, [briefing]);

  const speakText = (index: number) => {
    if (!window.speechSynthesis || index >= speechQueue.length) {
      setIsPlaying(false);
      setCurrentTextIndex(0);
      return;
    }

    window.speechSynthesis.cancel();
    setCurrentTextIndex(index);

    const text = speechQueue[index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (index + 1 < speechQueue.length) {
        speakText(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentTextIndex(0);
      }
    };

    utterance.onerror = (e) => {
      console.warn("TTS Error:", e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        setIsPlaying(true);
        speakText(currentTextIndex);
      }
    }
  };

  const handleRestart = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setCurrentTextIndex(0);
    setIsPlaying(true);
    speakText(0);
  };

  const handleChangeRate = () => {
    const nextRates = [1.0, 1.25, 1.5];
    const currentIndex = nextRates.indexOf(playbackRate);
    const nextRate = nextRates[(currentIndex + 1) % nextRates.length];
    setPlaybackRate(nextRate);
    if (isPlaying) {
      // restart current phrase with new rate
      speakText(currentTextIndex);
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  const progressPercent = speechQueue.length > 0 ? ((currentTextIndex + 1) / speechQueue.length) * 100 : 0;

  return (
    <div className="bg-[#0b1c35] text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700 mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Indicator & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f25c2a]/20 border border-[#f25c2a]/40 flex items-center justify-center text-[#f25c2a]">
            {isPlaying ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff8c66]">
                3-MIN AUDIO EXECUTIVE BRIEF
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                음성 낭독
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate max-w-md sm:max-w-xl">
              {isPlaying
                ? speechQueue[currentTextIndex] || "낭독 진행 중..."
                : "출근길 및 이동 중 3분 음성 브리핑을 청취하세요."}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleChangeRate}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-colors cursor-pointer"
            title="재생 속도 조절"
          >
            {playbackRate}x
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            title="처음부터 다시 듣기"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className="inline-flex items-center gap-2 bg-[#f25c2a] hover:bg-[#ea580c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-950/30 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>일시정지</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{currentTextIndex > 0 ? "이어듣기" : "브리핑 청취"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isPlaying && (
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#f25c2a] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
