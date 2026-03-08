import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type KeyboardEvent, useState } from "react";
import { toast } from "sonner";
import {
  ContentType,
  EngagementStyle,
  PostingFrequency,
  SocialPlatform,
} from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitAnalysis } from "../hooks/useQueries";

const PLATFORM_OPTIONS: {
  value: SocialPlatform;
  label: string;
  emoji: string;
  color: string;
}[] = [
  {
    value: SocialPlatform.twitter,
    label: "Twitter / X",
    emoji: "𝕏",
    color: "border-foreground/20 hover:border-foreground/50",
  },
  {
    value: SocialPlatform.linkedin,
    label: "LinkedIn",
    emoji: "in",
    color: "border-talent-analytical/30 hover:border-talent-analytical/60",
  },
  {
    value: SocialPlatform.instagram,
    label: "Instagram",
    emoji: "📸",
    color: "border-talent-empathetic/30 hover:border-talent-empathetic/60",
  },
  {
    value: SocialPlatform.reddit,
    label: "Reddit",
    emoji: "🤖",
    color:
      "border-talent-entrepreneurial/30 hover:border-talent-entrepreneurial/60",
  },
  {
    value: SocialPlatform.facebook,
    label: "Facebook",
    emoji: "f",
    color: "border-talent-analytical/30 hover:border-talent-analytical/60",
  },
  {
    value: SocialPlatform.tiktok,
    label: "TikTok",
    emoji: "♪",
    color: "border-talent-creative/30 hover:border-talent-creative/60",
  },
  {
    value: SocialPlatform.youtube,
    label: "YouTube",
    emoji: "▶",
    color:
      "border-talent-entrepreneurial/30 hover:border-talent-entrepreneurial/60",
  },
];

const CONTENT_TYPE_OPTIONS: {
  value: ContentType;
  label: string;
  icon: string;
}[] = [
  { value: ContentType.text, label: "Text Posts", icon: "✏️" },
  { value: ContentType.images, label: "Images", icon: "🖼️" },
  { value: ContentType.video, label: "Videos", icon: "🎬" },
  { value: ContentType.links, label: "Links", icon: "🔗" },
];

const ENGAGEMENT_OPTIONS: {
  value: EngagementStyle;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: EngagementStyle.creator,
    label: "Creator",
    description: "I create original content regularly",
    icon: "✨",
  },
  {
    value: EngagementStyle.commenter,
    label: "Commenter",
    description: "I engage deeply with others' content",
    icon: "💬",
  },
  {
    value: EngagementStyle.sharer,
    label: "Sharer",
    description: "I curate and share content I find valuable",
    icon: "🔄",
  },
  {
    value: EngagementStyle.lurker,
    label: "Lurker",
    description: "I mostly consume content silently",
    icon: "👁️",
  },
];

const FREQUENCY_OPTIONS: {
  value: PostingFrequency;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: PostingFrequency.daily,
    label: "Daily",
    description: "Every single day",
    icon: "🔥",
  },
  {
    value: PostingFrequency.weekly,
    label: "Weekly",
    description: "A few times per week",
    icon: "📅",
  },
  {
    value: PostingFrequency.monthly,
    label: "Monthly",
    description: "A few times per month",
    icon: "🗓️",
  },
  {
    value: PostingFrequency.rarely,
    label: "Rarely",
    description: "Less than monthly",
    icon: "💤",
  },
];

const STEP_LABELS = ["Basic Info", "Your Content", "Engagement Style"];

interface FormState {
  name: string;
  labelText: string;
  platform: SocialPlatform | null;
  topics: string[];
  topicInput: string;
  contentTypes: ContentType[];
  interests: string[];
  interestInput: string;
  engagementStyle: EngagementStyle | null;
  postingFrequency: PostingFrequency | null;
}

export function AnalysisFormPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { mutate: submitAnalysis, isPending, error } = useSubmitAnalysis();
  const [step, setStep] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    labelText: "",
    platform: null,
    topics: [],
    topicInput: "",
    contentTypes: [],
    interests: [],
    interestInput: "",
    engagementStyle: null,
    postingFrequency: null,
  });

  const update = (key: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addTag = (
    field: "topics" | "interests",
    inputField: "topicInput" | "interestInput",
  ) => {
    const val = form[inputField].trim().toLowerCase();
    if (!val) return;
    const arr = form[field] as string[];
    if (!arr.includes(val)) {
      update(field, [...arr, val]);
    }
    update(inputField, "");
  };

  const removeTag = (field: "topics" | "interests", tag: string) => {
    const arr = form[field] as string[];
    update(
      field,
      arr.filter((t) => t !== tag),
    );
  };

  const handleTagKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: "topics" | "interests",
    inputField: "topicInput" | "interestInput",
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(field, inputField);
    }
    if (e.key === "Backspace" && form[inputField] === "") {
      const arr = form[field] as string[];
      update(field, arr.slice(0, -1));
    }
  };

  const toggleContentType = (ct: ContentType) => {
    const arr = form.contentTypes;
    if (arr.includes(ct)) {
      update(
        "contentTypes",
        arr.filter((c) => c !== ct),
      );
    } else {
      update("contentTypes", [...arr, ct]);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim() && form.platform;
    if (step === 1)
      return form.topics.length > 0 && form.contentTypes.length > 0;
    if (step === 2) return form.engagementStyle && form.postingFrequency;
    return false;
  };

  const handleSubmit = () => {
    if (!identity) {
      setShowLoginPrompt(true);
      return;
    }

    if (!form.platform || !form.engagementStyle || !form.postingFrequency)
      return;

    submitAnalysis(
      {
        profile: {
          name: form.name.trim(),
          platform: form.platform,
          topics: form.topics,
          contentTypes: form.contentTypes,
          interests: form.interests,
          engagementStyle: form.engagementStyle,
          postingFrequency: form.postingFrequency,
        },
        labelText: form.labelText.trim() || null,
      },
      {
        onSuccess: (result) => {
          toast.success("Analysis complete!");
          void navigate({
            to: "/results/$id",
            params: { id: result.id.toString() },
          });
        },
        onError: (err) => {
          toast.error("Analysis failed. Please try again.");
          console.error(err);
        },
      },
    );
  };

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (!canProceed()) return;
    if (step < 2) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Analyse Your Talents
          </h1>
          <p className="text-muted-foreground">
            Tell us about your social media presence and we'll map your unique
            talent profile.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (i < step) {
                    setDirection(-1);
                    setStep(i);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  i === step
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : i < step
                      ? "text-primary/70 cursor-pointer hover:bg-primary/10"
                      : "text-muted-foreground cursor-default",
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold",
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                        ? "bg-primary/30 text-primary"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                {label}
              </button>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-px mx-1",
                    i < step ? "bg-primary/40" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="relative bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div
                key="step0"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="p-8"
                data-ocid="form.step1_panel"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                  Basic Information
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Tell us who you are and which platform to analyse.
                </p>

                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Your Name *
                    </Label>
                    <Input
                      id="name"
                      data-ocid="form.name_input"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="bg-input/50 border-border/50 focus:border-primary/60"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="label"
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      Analysis Label{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="label"
                      data-ocid="form.label_input"
                      value={form.labelText}
                      onChange={(e) => update("labelText", e.target.value)}
                      placeholder="e.g. My Twitter Profile Analysis"
                      className="bg-input/50 border-border/50 focus:border-primary/60"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Select Platform *
                    </Label>
                    <div
                      data-ocid="form.platform_select"
                      className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    >
                      {PLATFORM_OPTIONS.map((platform) => (
                        <button
                          key={platform.value}
                          type="button"
                          onClick={() => update("platform", platform.value)}
                          className={cn(
                            "relative p-4 rounded-xl border text-center transition-all duration-200 group",
                            form.platform === platform.value
                              ? "bg-primary/15 border-primary/60 text-foreground"
                              : `bg-muted/20 ${platform.color} text-muted-foreground hover:text-foreground`,
                          )}
                        >
                          <div className="text-2xl mb-1.5 leading-none">
                            {platform.emoji}
                          </div>
                          <div className="text-xs font-medium">
                            {platform.label}
                          </div>
                          {form.platform === platform.value && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-[8px] text-primary-foreground font-bold">
                                ✓
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="p-8"
                data-ocid="form.step2_panel"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                  Your Content
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  What do you post and talk about?
                </p>

                <div className="space-y-7">
                  {/* Topics */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Topics You Post About *
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Type a topic and press Enter or comma to add
                    </p>
                    <div className="min-h-[60px] p-3 bg-input/30 border border-border/50 rounded-lg flex flex-wrap gap-2 focus-within:border-primary/60 transition-colors">
                      {form.topics.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag("topics", tag)}
                            className="hover:text-destructive transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={form.topicInput}
                        onChange={(e) => update("topicInput", e.target.value)}
                        onKeyDown={(e) =>
                          handleTagKeyDown(e, "topics", "topicInput")
                        }
                        onBlur={() => addTag("topics", "topicInput")}
                        placeholder={
                          form.topics.length === 0
                            ? "technology, cooking, travel..."
                            : "Add more..."
                        }
                        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        "technology",
                        "design",
                        "business",
                        "health",
                        "art",
                        "science",
                      ].map(
                        (suggestion) =>
                          !form.topics.includes(suggestion) && (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => {
                                if (!form.topics.includes(suggestion)) {
                                  update("topics", [
                                    ...form.topics,
                                    suggestion,
                                  ]);
                                }
                              }}
                              className="text-xs px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border/40 transition-all flex items-center gap-1"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              {suggestion}
                            </button>
                          ),
                      )}
                    </div>
                  </div>

                  {/* Content Types */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Content Types *
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {CONTENT_TYPE_OPTIONS.map((ct) => (
                        <button
                          key={ct.value}
                          type="button"
                          onClick={() => toggleContentType(ct.value)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all",
                            form.contentTypes.includes(ct.value)
                              ? "bg-primary/15 border-primary/50 text-foreground"
                              : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70",
                          )}
                        >
                          <Checkbox
                            checked={form.contentTypes.includes(ct.value)}
                            className="pointer-events-none"
                          />
                          <span className="text-base">{ct.icon}</span>
                          <span className="text-sm font-medium">
                            {ct.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      Personal Interests{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <div className="min-h-[52px] p-3 bg-input/30 border border-border/50 rounded-lg flex flex-wrap gap-2 focus-within:border-primary/60 transition-colors">
                      {form.interests.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag("interests", tag)}
                            className="hover:text-destructive transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={form.interestInput}
                        onChange={(e) =>
                          update("interestInput", e.target.value)
                        }
                        onKeyDown={(e) =>
                          handleTagKeyDown(e, "interests", "interestInput")
                        }
                        onBlur={() => addTag("interests", "interestInput")}
                        placeholder={
                          form.interests.length === 0
                            ? "music, hiking, reading..."
                            : "Add more..."
                        }
                        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="p-8"
                data-ocid="form.step3_panel"
              >
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                  Engagement Style
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  How do you interact with social media?
                </p>

                <div className="space-y-7">
                  {/* Engagement Style */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Your Engagement Style *
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ENGAGEMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update("engagementStyle", opt.value)}
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                            form.engagementStyle === opt.value
                              ? "bg-primary/15 border-primary/50 text-foreground"
                              : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70",
                          )}
                        >
                          <span className="text-2xl mt-0.5">{opt.icon}</span>
                          <div>
                            <div className="font-semibold text-sm mb-0.5">
                              {opt.label}
                            </div>
                            <div className="text-xs opacity-80">
                              {opt.description}
                            </div>
                          </div>
                          {form.engagementStyle === opt.value && (
                            <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <span className="text-[9px] text-primary-foreground font-bold">
                                ✓
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Posting Frequency */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Posting Frequency *
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update("postingFrequency", opt.value)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                            form.postingFrequency === opt.value
                              ? "bg-primary/15 border-primary/50 text-foreground"
                              : "bg-muted/20 border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70",
                          )}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          <div>
                            <div className="font-semibold text-sm">
                              {opt.label}
                            </div>
                            <div className="text-xs opacity-80">
                              {opt.description}
                            </div>
                          </div>
                          {form.postingFrequency === opt.value && (
                            <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <span className="text-[9px] text-primary-foreground font-bold">
                                ✓
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {error && (
            <div
              data-ocid="form.error_state"
              className="mx-8 mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              Failed to submit analysis. Please try again.
            </div>
          )}

          {/* Navigation */}
          <div className="px-8 pb-8 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 0}
              data-ocid="form.back_button"
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === step
                      ? "w-6 h-2 bg-primary"
                      : i < step
                        ? "w-2 h-2 bg-primary/50"
                        : "w-2 h-2 bg-muted",
                  )}
                />
              ))}
            </div>

            {step < 2 ? (
              <Button
                onClick={goNext}
                disabled={!canProceed()}
                data-ocid="form.next_button"
                className="bg-primary/90 hover:bg-primary text-primary-foreground gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isPending}
                data-ocid="form.submit_button"
                className="bg-primary/90 hover:bg-primary text-primary-foreground gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analysing...
                  </>
                ) : (
                  <>
                    Analyse My Talents
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Loading Overlay */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="form.loading_state"
              className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl"
            >
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
                <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
              </div>
              <p className="font-display text-lg font-semibold text-foreground mb-1">
                Analysing your profile...
              </p>
              <p className="text-sm text-muted-foreground">
                This may take a moment
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent
          className="bg-card border-border/50 sm:max-w-md"
          data-ocid="auth.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Sign in to save your analysis
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You need to sign in to save your talent analysis. Your data is
              securely stored on the Internet Computer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground">
              <p className="font-medium mb-1">Why sign in?</p>
              <ul className="text-muted-foreground space-y-1 text-xs list-disc list-inside">
                <li>Save your talent analyses permanently</li>
                <li>Track your growth over time</li>
                <li>Access from any device</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowLoginPrompt(false)}
              data-ocid="auth.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                login();
                setShowLoginPrompt(false);
              }}
              data-ocid="auth.confirm_button"
              className="bg-primary/90 hover:bg-primary text-primary-foreground"
            >
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
