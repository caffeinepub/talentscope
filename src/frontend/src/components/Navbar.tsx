import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Navbar() {
  const location = useLocation();
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", ocid: "nav.home_link" },
    { to: "/analysis", label: "New Analysis", ocid: "nav.analysis_link" },
    { to: "/history", label: "History", ocid: "nav.history_link" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors" />
              <Zap className="w-4 h-4 text-primary relative z-10" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              TalentScope
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {identity ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-talent-communication animate-pulse" />
                  <span className="text-xs text-muted-foreground font-mono-custom">
                    {identity.getPrincipal().toString().slice(0, 8)}
                    ...
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                className="bg-primary/90 text-primary-foreground hover:bg-primary font-medium"
              >
                {isLoggingIn ? "Connecting..." : "Sign In"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid={link.ocid}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                    isActive(link.to)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 pb-1 border-t border-border/50">
                {identity ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    className="w-full justify-start text-muted-foreground"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn || isInitializing}
                    className="w-full bg-primary/90 text-primary-foreground hover:bg-primary"
                  >
                    {isLoggingIn ? "Connecting..." : "Sign In"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
