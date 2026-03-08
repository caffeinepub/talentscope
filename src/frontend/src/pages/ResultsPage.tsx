import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  History,
  Loader2,
  Share2,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { TalentCategory } from "../backend.d";
import { ScoreBar } from "../components/ScoreBar";
import { TalentBadge } from "../components/TalentBadge";
import { useGetAnalysis } from "../hooks/useQueries";
import { TALENT_CONFIG, formatDate, formatScore } from "../utils/talents";

export function ResultsPage() {
  const { id } = useParams({ from: "/results/$id" });
  const navigate = useNavigate();
  const analysisId = BigInt(id);
  const { data: analysis, isLoading, error } = useGetAnalysis(analysisId);

  const handleShare = () => {
    if (!analysis) return;
    const top3 = analysis.talentScores
      .sort((a, b) => Number(b.score) - Number(a.score))
      .slice(0, 3);
    const summary = [
      "🔭 My TalentScope Analysis",
      analysis.labelText ? `"${analysis.labelText}"` : "",
      "",
      "Top Talents:",
      ...top3.map(
        (ts) =>
          `${TALENT_CONFIG[ts.category].icon} ${TALENT_CONFIG[ts.category].label}: ${formatScore(ts.score)}/100`,
      ),
      "",
      "Discover your talents at TalentScope",
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    navigator.clipboard
      .writeText(summary)
      .then(() => toast.success("Summary copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div data-ocid="results.loading_state" className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
            <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🔭</span>
            </div>
          </div>
          <p className="font-display text-xl font-semibold">
            Loading your results...
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Fetching talent analysis
          </p>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Analysis Not Found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn't find this analysis. It may have been deleted.
          </p>
          <Button
            onClick={() => void navigate({ to: "/history" })}
            variant="outline"
            className="border-border/50"
          >
            View History
          </Button>
        </div>
      </main>
    );
  }

  const sortedScores = [...analysis.talentScores].sort(
    (a, b) => Number(b.score) - Number(a.score),
  );
  const top3 = sortedScores.slice(0, 3);
  const allScores = sortedScores;

  const trophyColors = [
    "text-talent-strategic",
    "text-muted-foreground",
    "text-talent-entrepreneurial",
  ];
  const trophyLabels = ["Gold", "Silver", "Bronze"];

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground font-mono-custom uppercase tracking-widest">
                  Analysis Result
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(analysis.timestamp)}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                {analysis.labelText || "Your Talent Analysis"}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-muted-foreground">Platform:</span>
                <span className="text-xs font-medium text-foreground capitalize px-2 py-0.5 rounded-full bg-muted/40 border border-border/50">
                  {analysis.profile.platform}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">
                  {analysis.profile.name}
                </span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                data-ocid="results.share_button"
                className="border border-border/50 text-muted-foreground hover:text-foreground gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void navigate({ to: "/history" })}
                data-ocid="results.save_button"
                className="border-border/50 gap-2"
              >
                <History className="w-3.5 h-3.5" />
                View History
              </Button>
              <Button
                size="sm"
                onClick={() => void navigate({ to: "/analysis" })}
                data-ocid="results.new_analysis_button"
                className="bg-primary/90 hover:bg-primary text-primary-foreground gap-2"
              >
                New Analysis
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Top 3 Talents */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-5"
          >
            <Trophy className="w-5 h-5 text-talent-strategic" />
            <h2 className="font-display text-xl font-bold text-foreground">
              Top 3 Talents
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((ts, i) => {
              const config = TALENT_CONFIG[ts.category as TalentCategory];
              const score = formatScore(ts.score);
              return (
                <motion.div
                  key={ts.category}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.1,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  data-ocid={`results.top_talent.card.${i + 1}`}
                  className={cn(
                    "relative p-6 rounded-2xl border bg-card/60 backdrop-blur-md overflow-hidden group",
                    config.borderColor,
                    i === 0 && "sm:order-2 sm:scale-105",
                  )}
                >
                  {/* Background glow */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity",
                      `bg-${config.color}`,
                    )}
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, oklch(var(--${config.color}) / 0.2), transparent 70%)`,
                    }}
                  />

                  {/* Trophy indicator */}
                  <div
                    className={cn(
                      "flex items-center gap-1.5 mb-4",
                      trophyColors[i],
                    )}
                  >
                    <Trophy className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {trophyLabels[i]}
                    </span>
                  </div>

                  {/* Icon and name */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <div
                        className={cn(
                          "font-display text-sm font-bold uppercase tracking-wider",
                          config.textColor,
                        )}
                      >
                        {config.label}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div
                    className={cn(
                      "font-mono-custom font-bold mb-3",
                      config.textColor,
                    )}
                  >
                    <span className="text-5xl">{score}</span>
                    <span className="text-xl opacity-50">/100</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{
                        delay: 0.4 + i * 0.1,
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={cn(
                        "h-full rounded-full",
                        `bg-${config.color}`,
                      )}
                      style={{
                        boxShadow: `0 0 8px oklch(var(--${config.color}) / 0.6)`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {ts.insight}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* All Talent Scores */}
        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mb-5"
          >
            <BarChart className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-xl font-bold text-foreground">
              Full Talent Profile
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {allScores.map((ts, i) => (
                <div
                  key={ts.category}
                  data-ocid={`results.talent_score.item.${i + 1}`}
                >
                  <ScoreBar
                    category={ts.category as TalentCategory}
                    score={ts.score}
                    insight={ts.insight}
                    index={i}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Top Categories */}
        {analysis.topCategories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm"
          >
            <h3 className="font-display font-semibold text-foreground mb-4">
              Your Core Talents
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.topCategories.map((cat) => (
                <TalentBadge
                  key={cat}
                  category={cat as TalentCategory}
                  size="md"
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Action Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border/30"
        >
          <p className="text-sm text-muted-foreground text-center">
            Want to explore your talents on another platform?
          </p>
          <Button
            onClick={() => void navigate({ to: "/analysis" })}
            data-ocid="results.new_analysis_button"
            className="bg-primary/90 hover:bg-primary text-primary-foreground gap-2"
          >
            Run Another Analysis
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </main>
  );
}

function BarChart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}
