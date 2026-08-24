import { BadgeTone } from "@/components/ui/Badge";

const TONE_TEXT_CLASSES: Record<BadgeTone, string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
  info: "text-sky-600 dark:text-sky-400",
  neutral: "text-fg-muted",
};

export function toneTextClass(tone: BadgeTone): string {
  return TONE_TEXT_CLASSES[tone];
}

export function difficultyTone(difficulty: string): BadgeTone {
  switch (difficulty) {
    case "EASY":
      return "success";
    case "MEDIUM":
      return "warning";
    case "HARD":
      return "danger";
    default:
      return "neutral";
  }
}

export function submissionStatusTone(status: string): BadgeTone {
  switch (status) {
    case "ACCEPTED":
    case "PASSED":
      return "success";
    case "QUEUED":
    case "RUNNING":
    case "COMPILING":
      return "warning";
    case "WRONG_ANSWER":
    case "RUNTIME_ERROR":
    case "COMPILE_ERROR":
    case "TIME_LIMIT":
    case "MEMORY_LIMIT":
    case "SYSTEM_ERROR":
      return "danger";
    default:
      return "neutral";
  }
}

export function contestPhaseTone(phase: string): BadgeTone {
  switch (phase) {
    case "RUNNING":
      return "success";
    case "UPCOMING":
      return "info";
    case "ENDED":
      return "neutral";
    default:
      return "neutral";
  }
}

export function problemStatusTone(status: string): BadgeTone {
  switch (status) {
    case "PUBLISHED":
      return "success";
    case "DRAFT":
      return "warning";
    case "ARCHIVED":
      return "neutral";
    default:
      return "neutral";
  }
}
