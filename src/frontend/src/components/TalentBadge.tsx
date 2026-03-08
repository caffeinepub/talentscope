import { cn } from "@/lib/utils";
import type { TalentCategory } from "../backend.d";
import { TALENT_CONFIG } from "../utils/talents";

interface TalentBadgeProps {
  category: TalentCategory;
  size?: "sm" | "md";
  className?: string;
}

export function TalentBadge({
  category,
  size = "sm",
  className,
}: TalentBadgeProps) {
  const config = TALENT_CONFIG[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border",
        config.bgColor,
        config.borderColor,
        config.textColor,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        className,
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
