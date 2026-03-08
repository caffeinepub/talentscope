import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { TalentCategory } from "../backend.d";
import { TALENT_CONFIG, formatScore } from "../utils/talents";

interface ScoreBarProps {
  category: TalentCategory;
  score: bigint;
  insight: string;
  index?: number;
}

export function ScoreBar({
  category,
  score,
  insight,
  index = 0,
}: ScoreBarProps) {
  const config = TALENT_CONFIG[category];
  const scoreNum = formatScore(score);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), index * 80);
        }
      },
      { threshold: 0.1 },
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [index]);

  return (
    <div
      ref={ref}
      className={cn(
        "p-4 rounded-xl border bg-card/40 backdrop-blur-sm transition-all duration-300",
        config.borderColor,
        "hover:bg-card/60",
      )}
      style={{
        opacity: animated ? 1 : 0,
        transform: animated ? "none" : "translateY(8px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{config.icon}</span>
          <span className={cn("text-sm font-semibold", config.textColor)}>
            {config.label}
          </span>
        </div>
        <span
          className={cn("font-mono-custom font-bold text-lg", config.textColor)}
        >
          {scoreNum}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden mb-2">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            `bg-${config.color}`,
          )}
          style={{
            width: animated ? `${scoreNum}%` : "0%",
            boxShadow: `0 0 8px oklch(var(--${config.color}) / 0.5)`,
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {insight}
      </p>
    </div>
  );
}
