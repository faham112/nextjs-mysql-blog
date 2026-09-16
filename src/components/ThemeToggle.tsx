"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const light = theme === "light";
  return (
    <button type="button" onClick={toggle} aria-label={light ? "Switch to dark" : "Switch to light"} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border" style={{ borderColor: "var(--border)", color: "var(--fg)", background: "var(--bg2)" }}>
      {light ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
