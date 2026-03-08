import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  Clock,
  Loader2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { TalentCategory } from "../backend.d";
import { TalentBadge } from "../components/TalentBadge";
import { useDeleteAnalysis, useListAnalyses } from "../hooks/useQueries";
import { TALENT_CONFIG, formatDate, formatScore } from "../utils/talents";

export function HistoryPage() {
  const navigate = useNavigate();
  const { data: analyses, isLoading, error } = useListAnalyses();
  const { mutate: deleteAnalysis, isPending: isDeleting } = useDeleteAnalysis();
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  const handleDelete = (id: bigint) => {
    deleteAnalysis(id, {
      onSuccess: () => {
        toast.success("Analysis deleted");
        setConfirmDeleteId(null);
      },
      onError: () => {
        toast.error("Failed to delete analysis");
      },
    });
  };

  const sorted = analyses
    ? [...analyses].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    : [];

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-1">
              Analysis History
            </h1>
            <p className="text-muted-foreground text-sm">
              {sorted.length > 0
                ? `${sorted.length} ${sorted.length === 1 ? "analysis" : "analyses"} saved`
                : "No analyses yet"}
            </p>
          </div>
          <Button
            onClick={() => void navigate({ to: "/analysis" })}
            className="bg-primary/90 hover:bg-primary text-primary-foreground gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            New Analysis
          </Button>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Loading analyses...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center max-w-sm">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-destructive" />
              </div>
              <p className="text-foreground font-semibold mb-1">
                Failed to load
              </p>
              <p className="text-muted-foreground text-sm">
                Could not fetch your analyses. Please try again later.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && sorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            data-ocid="history.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-center mb-6 text-4xl">
              🔭
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              No analyses yet
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mb-8">
              Run your first talent analysis to discover your hidden strengths
              based on your social media footprint.
            </p>
            <Button
              onClick={() => void navigate({ to: "/analysis" })}
              className="bg-primary/90 hover:bg-primary text-primary-foreground gap-2"
            >
              Start Your First Analysis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Analysis List */}
        {!isLoading && !error && sorted.length > 0 && (
          <div data-ocid="history.list" className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sorted.map((analysis, idx) => {
                const topScore =
                  analysis.talentScores.length > 0
                    ? Math.max(
                        ...analysis.talentScores.map((ts) =>
                          formatScore(ts.score),
                        ),
                      )
                    : 0;

                return (
                  <motion.div
                    key={analysis.id.toString()}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.4 }}
                    data-ocid={`history.item.${idx + 1}`}
                    className="group relative p-5 sm:p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-border/80 transition-all duration-300 cursor-pointer"
                    onClick={() =>
                      void navigate({
                        to: "/results/$id",
                        params: { id: analysis.id.toString() },
                      })
                    }
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: icon + info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <BarChart2 className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {analysis.labelText || "Talent Analysis"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDate(analysis.timestamp)}
                            </span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-muted/40 border border-border/40">
                              {analysis.profile.platform}
                            </span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-xs text-muted-foreground">
                              {analysis.profile.name}
                            </span>
                          </div>

                          {/* Top talent badges */}
                          {analysis.topCategories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {analysis.topCategories.slice(0, 3).map((cat) => (
                                <TalentBadge
                                  key={cat}
                                  category={cat as TalentCategory}
                                  size="sm"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: score + actions */}
                      <div className="flex items-center gap-3 sm:shrink-0">
                        {/* Top score */}
                        <div className="text-right hidden sm:block">
                          <div className="font-mono-custom font-bold text-2xl text-primary">
                            {topScore}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            top score
                          </div>
                        </div>

                        {/* Delete */}
                        <Button
                          variant="ghost"
                          size="icon"
                          data-ocid={`history.delete_button.${idx + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(analysis.id);
                          }}
                          className={cn(
                            "w-9 h-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                            "opacity-0 group-hover:opacity-100 transition-all",
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        {/* Arrow */}
                        <div className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-border transition-all">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
      >
        <AlertDialogContent
          className="bg-card border-border/50"
          data-ocid="history.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Analysis?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The analysis will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="history.cancel_button"
              className="border-border/50 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="history.confirm_button"
              onClick={() => {
                if (confirmDeleteId !== null) handleDelete(confirmDeleteId);
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
