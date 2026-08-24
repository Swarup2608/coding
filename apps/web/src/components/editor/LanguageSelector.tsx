"use client";

import { Language } from "@/types/problem";
import { languages } from "@/lib/languages";

interface Props {
  value: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as Language)} className="rounded border px-3 py-2">
      {Object.entries(languages).map(([key, config]) => (
        <option key={key} value={key}>{config.label}</option>
      ))}
    </select>
  );
}
