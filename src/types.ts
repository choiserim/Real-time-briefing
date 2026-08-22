export interface MacroNewsItem {
  id: string;
  title: string;
  desc: string;
  source: string;
  url: string;
  tag?: string;
  impact?: string;
}

export interface FundingItem {
  id: string;
  title: string;
  desc: string;
  agency: string;
  budget: string;
  deadline: string;
  dDay?: number | null;
  target: string;
  url: string;
  urgent: boolean;
  keyRequirements?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface BriefingData {
  reportDate: string;
  baseRate: string;
  exchangeRate?: string;
  baseRateChange?: string;
  exchangeRateChange?: string;
  panelHeadline: string;
  macroNews: MacroNewsItem[];
  exportFunding: FundingItem[];
  startupFunding: FundingItem[];
  todayPoint: string;
  groundingSources?: GroundingSource[];
}

export type CategoryFilter = "ALL" | "MACRO" | "EXPORT" | "STARTUP" | "URGENT" | "BOOKMARKS";
