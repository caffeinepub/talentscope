import { TalentCategory } from "../backend.d";

export interface TalentConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
}

export const TALENT_CONFIG: Record<TalentCategory, TalentConfig> = {
  [TalentCategory.analytical]: {
    label: "Analytical",
    color: "talent-analytical",
    bgColor: "bg-talent-analytical/10",
    borderColor: "border-talent-analytical/30",
    textColor: "text-talent-analytical",
    gradientFrom: "from-talent-analytical",
    gradientTo: "to-talent-analytical/50",
    icon: "🔬",
  },
  [TalentCategory.creative]: {
    label: "Creative",
    color: "talent-creative",
    bgColor: "bg-talent-creative/10",
    borderColor: "border-talent-creative/30",
    textColor: "text-talent-creative",
    gradientFrom: "from-talent-creative",
    gradientTo: "to-talent-creative/50",
    icon: "🎨",
  },
  [TalentCategory.leadership]: {
    label: "Leadership",
    color: "talent-leadership",
    bgColor: "bg-talent-leadership/10",
    borderColor: "border-talent-leadership/30",
    textColor: "text-talent-leadership",
    gradientFrom: "from-talent-leadership",
    gradientTo: "to-talent-leadership/50",
    icon: "👑",
  },
  [TalentCategory.communication]: {
    label: "Communication",
    color: "talent-communication",
    bgColor: "bg-talent-communication/10",
    borderColor: "border-talent-communication/30",
    textColor: "text-talent-communication",
    gradientFrom: "from-talent-communication",
    gradientTo: "to-talent-communication/50",
    icon: "💬",
  },
  [TalentCategory.technical]: {
    label: "Technical",
    color: "talent-technical",
    bgColor: "bg-talent-technical/10",
    borderColor: "border-talent-technical/30",
    textColor: "text-talent-technical",
    gradientFrom: "from-talent-technical",
    gradientTo: "to-talent-technical/50",
    icon: "⚙️",
  },
  [TalentCategory.entrepreneurial]: {
    label: "Entrepreneurial",
    color: "talent-entrepreneurial",
    bgColor: "bg-talent-entrepreneurial/10",
    borderColor: "border-talent-entrepreneurial/30",
    textColor: "text-talent-entrepreneurial",
    gradientFrom: "from-talent-entrepreneurial",
    gradientTo: "to-talent-entrepreneurial/50",
    icon: "🚀",
  },
  [TalentCategory.empathetic]: {
    label: "Empathetic",
    color: "talent-empathetic",
    bgColor: "bg-talent-empathetic/10",
    borderColor: "border-talent-empathetic/30",
    textColor: "text-talent-empathetic",
    gradientFrom: "from-talent-empathetic",
    gradientTo: "to-talent-empathetic/50",
    icon: "❤️",
  },
  [TalentCategory.strategic]: {
    label: "Strategic",
    color: "talent-strategic",
    bgColor: "bg-talent-strategic/10",
    borderColor: "border-talent-strategic/30",
    textColor: "text-talent-strategic",
    gradientFrom: "from-talent-strategic",
    gradientTo: "to-talent-strategic/50",
    icon: "♟️",
  },
};

export function getTalentConfig(category: TalentCategory): TalentConfig {
  return TALENT_CONFIG[category];
}

export function formatScore(score: bigint): number {
  return Math.min(100, Math.max(0, Number(score)));
}

export function formatDate(timestamp: bigint): string {
  // Motoko timestamps are in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
