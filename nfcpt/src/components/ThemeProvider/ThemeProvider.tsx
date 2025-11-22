"use client";

import { useEffect } from "react";
import { themeConfig } from "@/config/theme.config";

/**
 * ThemeProvider component that applies theme configuration to CSS custom properties
 * This allows dynamic theme switching and configuration-based styling
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;

    // Apply color theme
    root.style.setProperty("--primaryColor", themeConfig.colors.primary);
    root.style.setProperty("--accentColor", themeConfig.colors.accent);
    root.style.setProperty("--darkColor", themeConfig.colors.secondary);
    root.style.setProperty("--background", themeConfig.colors.background);
    root.style.setProperty("--surface", themeConfig.colors.surface);
    root.style.setProperty("--textPrimary", themeConfig.colors.text.primary);
    root.style.setProperty(
      "--textSecondary",
      themeConfig.colors.text.secondary
    );
    root.style.setProperty("--textMuted", themeConfig.colors.text.muted);
    root.style.setProperty("--border", themeConfig.colors.border);
    root.style.setProperty("--success", themeConfig.colors.success);
    root.style.setProperty("--warning", themeConfig.colors.warning);
    root.style.setProperty("--error", themeConfig.colors.error);

    // Apply font theme
    root.style.setProperty("--primaryFont", themeConfig.fonts.primary);
    root.style.setProperty("--secondaryFont", themeConfig.fonts.secondary);

    // Apply spacing theme
    Object.entries(themeConfig.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius theme
    Object.entries(themeConfig.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Apply shadow theme
    Object.entries(themeConfig.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  }, []);

  return <>{children}</>;
}
