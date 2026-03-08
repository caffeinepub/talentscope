import { Heart, Zap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border/50 bg-background/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-sm text-foreground">
              TalentScope
            </span>
            <span className="text-muted-foreground text-xs">—</span>
            <span className="text-muted-foreground text-xs">
              Discover your hidden potential
            </span>
          </div>
          <p className="text-muted-foreground text-xs flex items-center gap-1.5">
            © {year}. Built with{" "}
            <Heart className="w-3 h-3 text-talent-empathetic inline" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
