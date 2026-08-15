export interface EventTheme {
  value: "classic" | "midnight" | "sunset" | "mono";
  label: string;
  primary: string;
  accent: string;
}

export const EVENT_THEMES: EventTheme[] = [
  { value: "classic", label: "Classic", primary: "#7c3aed", accent: "#ec4899" },
  { value: "midnight", label: "Midnight", primary: "#2563eb", accent: "#38bdf8" },
  { value: "sunset", label: "Sunset", primary: "#f97316", accent: "#fb7185" },
  { value: "mono", label: "Mono", primary: "#ffffff", accent: "#ffffff" },
];

export const getEventThemeStyle = (theme?: string): React.CSSProperties => {
  const preset =
    EVENT_THEMES.find((t) => t.value === theme) || EVENT_THEMES[3];
  return {
    "--color-primary": preset.primary,
    "--color-accent": preset.accent,
    "--gradient-aurora": `linear-gradient(135deg, ${preset.primary} 0%, ${preset.accent} 100%)`,
    "--btn-aurora-text": preset.value === "mono" ? "#000" : "#fff",
  } as React.CSSProperties;
};
