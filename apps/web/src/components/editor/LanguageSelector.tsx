"use client";

import { Language } from "@/types/problem";
import { languages } from "@/lib/languages";

interface Props {
  value: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as Language)}
      className="rounded-md border border-border bg-page px-3 py-2 text-fg focus:border-accent focus:outline-none"
    >
      {Object.entries(languages).map(([key, config]) => (
        <option key={key} value={key}>{config.label}</option>
      ))}
    </select>
  );
}
