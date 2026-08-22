import React, { useState } from "react";
import { X, CheckCircle2, AlertTriangle, Calculator, ArrowRight, Sparkles } from "lucide-react";

interface EligibilityCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsult: (question: string) => void;
}

export const EligibilityCalculatorModal: React.FC<EligibilityCalculatorModalProps> = ({
  isOpen,
  onClose,
  onConsult,
}) => {
  const [industry, setIndustry] = useState("manufacturing"); // manufacturing, it_service, wholesale, construction, other
  const [companyAge, setCompanyAge] = useState("under_3"); // under_3, 3_to_7, over_7
  const [revenue, setRevenue] = useState("10_to_50"); // under_10, 10_to_50, over_50
  const [hasExport, setHasExport] = useState(true);
  const [hasPatent, setHasPatent] = useState(true);
  const [hasTaxArrears, setHasTaxArrears] = useState(false);
  const [debtRatio, setDebtRatio] = useState("normal"); // under_200, 200_to_400, over_400

  if (!isOpen) return null;

  // Evaluation logic
  const calculateEligibility = () => {
    if (hasTaxArrears) {
      return {
        status: "REJECTED",
        title: "국세/지방세 체납으로 인한 신청 불가",
        desc: "모든 정부 정책자금 및 보증기관은 세금 체납 시 접수가 원천 차단됩니다. 완납 후 즉시 재신청이 가능합니다.",
        recommendations: ["국세청 홈택스 및 위택스 체납 세액 납부 완료 증명서 발급"],
      };
    }

    if (debtRatio === "over_400") {
      return {
        status: "WARNING",
        title: "부채비율 400% 초과 주의",
        desc: "한계기업 요건에 해당할 수 있어 일반 융자 승인률이 낮아질 수 있습니다. 기술력 기반 기보 특례보증이나 구조개선 자금을 고려해야 합니다.",
        recommendations: ["기술보증기금 IP보증", "중진공 기업구조개선 자금", "가수금 자본전환"],
      };
    }

    const recs: string[] = [];

    if (companyAge === "under_3" || companyAge === "3_to_7") {
      recs.push("중진공 혁신창업사업화자금 (연 2%대 저금리 직접대출)");
      if (hasPatent) recs.push("중기부 TIPS 프로그램 및 디딤돌 R&D 지원 (최대 5~7억원)");
    }

    if (industry === "manufacturing") {
      recs.push("스마트공장 구축 및 고도화 지원사업 (국비 50% 매칭, 최대 2억원)");
      recs.push("신용보증기금/기술보증기금 제조업 우대 시설·운전자금 보증");
    }

    if (hasExport) {
      recs.push("중기부 수출바우처 사업 (해외마케팅·인증 14개 분야 최대 1억원 바우처)");
      recs.push("무역보험공사 수출신용보증 및 환변동보험 무료 가입");
    }

    if (companyAge === "over_7" && revenue !== "under_10") {
      recs.push("중진공 신시장진출지원자금 및 개발기술사업화자금");
      recs.push("시중은행 이차보전 연계 중소기업 육성자금 (금리 1~2%p 차감 지원)");
    }

    return {
      status: "ELIGIBLE",
      title: "정책자금 다수 트랙 신청 적합 기업",
      desc: "기본 자격요건 및 가점 요소를 충분히 갖추고 있어 최대 5억~30억원 한도의 정책자금 융자 및 국비 보조금 바우처 수혜 가능성이 높습니다.",
      recommendations: recs.length > 0 ? recs : ["중진공 일반 경영안정자금", "지역 신용보증재단 특례보증"],
    };
  };

  const result = calculateEligibility();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 font-sans">
        {/* Header */}
        <div className="bg-[#0b1c35] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#f25c2a]" />
            <div>
              <h3 className="text-base font-bold font-serif">
                정책자금 신청 적합도 1분 자가진단
              </h3>
              <p className="text-xs text-slate-300">
                우리 회사 현황에 맞는 최적의 정부 지원 트랙 산출
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

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-slate-50/50">
          {/* Industry */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. 주력 업종
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#0b1c35]"
            >
              <option value="manufacturing">제조업 (공장등록/뿌리/첨단제조)</option>
              <option value="it_service">IT / 소프트웨어 / AI / 지식서비스</option>
              <option value="wholesale">도소매 / 무역 / 전자상거래</option>
              <option value="construction">건설 / 환경 / 에너지</option>
              <option value="other">기타 서비스업</option>
            </select>
          </div>

          {/* Company Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. 업력 (설립 연차)
              </label>
              <select
                value={companyAge}
                onChange={(e) => setCompanyAge(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#0b1c35]"
              >
                <option value="under_3">초기창업 (3년 미만)</option>
                <option value="3_to_7">창업도약기 (3~7년)</option>
                <option value="over_7">성장/중견 (7년 초과)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                3. 직전 연매출
              </label>
              <select
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#0b1c35]"
              >
                <option value="under_10">10억원 미만</option>
                <option value="10_to_50">10억 ~ 50억원</option>
                <option value="over_50">50억원 초과</option>
              </select>
            </div>
          </div>

          {/* Debt ratio & Checks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. 부채비율 상태
              </label>
              <select
                value={debtRatio}
                onChange={(e) => setDebtRatio(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#0b1c35]"
              >
                <option value="under_200">우수 (200% 미만)</option>
                <option value="200_to_400">보통 (200~400%)</option>
                <option value="over_400">주의 (400% 초과)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                5. 세금 체납 여부
              </label>
              <select
                value={hasTaxArrears ? "yes" : "no"}
                onChange={(e) => setHasTaxArrears(e.target.value === "yes")}
                className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#0b1c35]"
              >
                <option value="no">체납 없음 (정상)</option>
                <option value="yes">체납 있음 (결격사유)</option>
              </select>
            </div>
          </div>

          {/* Boolean checkboxes */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasExport}
                onChange={(e) => setHasExport(e.target.checked)}
                className="w-4 h-4 text-[#f25c2a] rounded accent-[#f25c2a]"
              />
              <span className="font-semibold text-slate-800">직접 또는 간접 수출 실적이 있거나 희망함</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPatent}
                onChange={(e) => setHasPatent(e.target.checked)}
                className="w-4 h-4 text-[#f25c2a] rounded accent-[#f25c2a]"
              />
              <span className="font-semibold text-slate-800">등록 특허 또는 기업부설연구소/전담부서 보유</span>
            </label>
          </div>

          {/* Real-time Result Box */}
          <div
            className={`p-4 rounded-xl border ${
              result.status === "ELIGIBLE"
                ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                : result.status === "WARNING"
                ? "bg-amber-50 border-amber-300 text-amber-950"
                : "bg-red-50 border-red-300 text-red-950"
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {result.status === "ELIGIBLE" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              <span>{result.title}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed opacity-90">{result.desc}</p>

            <div className="mt-3 pt-2.5 border-t border-current/20">
              <strong className="text-xs font-bold block mb-1.5">추천 우선 신청 트랙:</strong>
              <ul className="space-y-1 text-xs">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-[#f25c2a] font-bold">✔</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            닫기
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onConsult(
                `우리 회사는 업종: ${industry}, 업력: ${companyAge}, 매출: ${revenue}, 부채비율: ${debtRatio}, 수출: ${
                  hasExport ? "있음" : "없음"
                }, 특허/연구소: ${
                  hasPatent ? "있음" : "없음"
                } 조건입니다. 최우선 신청해야 할 3대 정책자금과 신청 승인 확률을 높이는 전략을 상담해 주세요.`
              );
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b1c35] hover:bg-[#142d4d] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>이 조건으로 AI 심층 자문 받기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
