export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  danger: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  info: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  neutral: "bg-fg-muted/15 text-fg-muted",
};

export default function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
