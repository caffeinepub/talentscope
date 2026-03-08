import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useListAnalyses } from "../hooks/useQueries";
import { useCreateSeeds } from "../hooks/useQueries";

export function HomePage() {
  const navigate = useNavigate();
  const { data: analyses } = useListAnalyses();
  const { mutate: createSeeds, isPending: isCreatingSeeds } = useCreateSeeds();

  const handleViewSamples = () => {
    if (analyses && analyses.length > 0) {
      void navigate({ to: "/history" });
    } else {
      createSeeds(undefined, {
        onSuccess: () => {
          toast.success("Sample data created!");
          void navigate({ to: "/history" });
        },
        onError: () => {
          void navigate({ to: "/history" });
        },
      });
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "8 Talent Categories",
      description:
        "From analytical thinking to creative expression, leadership, and empathy — we map your complete talent landscape.",
      color: "text-talent-analytical",
      bgColor: "bg-talent-analytical/10",
      borderColor: "border-talent-analytical/20",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Personalized Insights",
      description:
        "AI-powered analysis of your social footprint reveals hidden strengths you might never have considered.",
      color: "text-talent-creative",
      bgColor: "bg-talent-creative/10",
      borderColor: "border-talent-creative/20",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Your Growth",
      description:
        "Run multiple analyses over time across different platforms to see how your talents evolve.",
      color: "text-talent-strategic",
      bgColor: "bg-talent-strategic/10",
      borderColor: "border-talent-strategic/20",
    },
  ];

  const talentPills = [
    {
      label: "Analytical",
      color:
        "text-talent-analytical bg-talent-analytical/10 border-talent-analytical/20",
    },
    {
      label: "Creative",
      color:
        "text-talent-creative bg-talent-creative/10 border-talent-creative/20",
    },
    {
      label: "Leadership",
      color:
        "text-talent-leadership bg-talent-leadership/10 border-talent-leadership/20",
    },
    {
      label: "Technical",
      color:
        "text-talent-technical bg-talent-technical/10 border-talent-technical/20",
    },
    {
      label: "Strategic",
      color:
        "text-talent-strategic bg-talent-strategic/10 border-talent-strategic/20",
    },
    {
      label: "Empathetic",
      color:
        "text-talent-empathetic bg-talent-empathetic/10 border-talent-empathetic/20",
    },
    {
      label: "Communication",
      color:
        "text-talent-communication bg-talent-communication/10 border-talent-communication/20",
    },
    {
      label: "Entrepreneurial",
      color:
        "text-talent-entrepreneurial bg-talent-entrepreneurial/10 border-talent-entrepreneurial/20",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-talentscope.dim_1600x800.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Decorative mesh */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-medium font-mono-custom uppercase tracking-widest">
                Talent Analysis Platform
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              <span className="text-foreground">Discover your</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                hidden talents
              </span>
              <br />
              <span className="text-foreground">through your</span>
              <br />
              <span className="text-foreground">social footprint</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
              TalentScope analyses your social media interactions, posting
              patterns, and engagement style to reveal your unique strengths and
              growth potential.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => void navigate({ to: "/analysis" })}
                data-ocid="home.start_button"
                className="group bg-primary/90 hover:bg-primary text-primary-foreground font-semibold px-8 h-12 gap-2 shadow-glow transition-all duration-300"
              >
                Start Analysis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleViewSamples}
                data-ocid="home.sample_button"
                disabled={isCreatingSeeds}
                className="border-border/50 text-foreground hover:bg-muted/40 h-12 px-8 font-medium"
              >
                {isCreatingSeeds ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-foreground/50 border-t-foreground rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "View Sample Results"
                )}
              </Button>
            </div>
          </motion.div>

          {/* Floating talent pills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block"
          >
            <div className="flex flex-col gap-3 items-end">
              {talentPills.map((pill, i) => (
                <motion.div
                  key={pill.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${pill.color}`}
                >
                  {pill.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 border-t border-border/30">
        <div className="absolute inset-0 bg-mesh pointer-events-none opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How TalentScope works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A sophisticated analysis engine maps your digital behaviour to
              actionable talent insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className={`relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm ${feature.borderColor} hover:bg-card/70 transition-all duration-300 group`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div
                  className={`absolute bottom-4 right-4 ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: "8",
                label: "Talent Categories",
                color: "text-talent-analytical",
              },
              {
                value: "7",
                label: "Social Platforms",
                color: "text-talent-creative",
              },
              {
                value: "100%",
                label: "Personalised",
                color: "text-talent-leadership",
              },
              {
                value: "∞",
                label: "Analyses Over Time",
                color: "text-talent-strategic",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className={`font-display text-4xl sm:text-5xl font-bold ${stat.color} mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to discover your talents?
            </h2>
            <p className="text-muted-foreground mb-8">
              It takes less than 2 minutes. No account needed to get started.
            </p>
            <Button
              size="lg"
              onClick={() => void navigate({ to: "/analysis" })}
              className="group bg-primary/90 hover:bg-primary text-primary-foreground font-semibold px-10 h-13 gap-2 shadow-glow-lg"
            >
              Start Your Free Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
